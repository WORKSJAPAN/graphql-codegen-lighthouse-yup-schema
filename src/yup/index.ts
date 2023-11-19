import { indent } from '@graphql-codegen/visitor-plugin-common';
import {
  FieldDefinitionNode,
  GraphQLSchema,
  InputValueDefinitionNode,
  NameNode,
  ObjectTypeDefinitionNode,
  TypeNode,
} from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { buildApi, GeneratedCodesForDirectives } from '../directive';
import { Interpreter, NewVisitor } from '../types';
import { Visitor } from '../visitor';
import { VisitorFactory } from '../VisitorFactory';
import { isInput, isListType, isNamedType, isNonNullType } from './../graphql';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { Registry } from './registry';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { createWithObjectTypesSpec } from './withObjectTypesSpecs/factory';
import { WithObjectTypesSpec } from './withObjectTypesSpecs/WithObjectTypesSpec';

export class YupSchemaVisitor implements NewVisitor, Interpreter {
  private readonly registry: Registry;
  private exportTypeStrategy: ExportTypeStrategy;
  private visitorFactory: VisitorFactory;
  private importBuilder: ImportBuilder;
  private initialEmitter: InitialEmitter;
  private withObjectTypesSpec: WithObjectTypesSpec;
  private readonly inputObjectTypeDefinitionFactory: InputObjectTypeDefinitionFactory;
  private readonly enumTypeDefinitionFactory: EnumTypeDefinitionFactory;
  private readonly unionTypesDefinitionFactory: UnionTypesDefinitionFactory;

  constructor(
    schema: GraphQLSchema,
    private readonly config: ValidationSchemaPluginConfig
  ) {
    this.registry = new Registry();
    this.visitorFactory = new VisitorFactory(schema, config);
    this.exportTypeStrategy = createExportTypeStrategy(config.validationSchemaExportType);
    this.importBuilder = new ImportBuilder(config.importFrom, config.useTypeImports);
    this.initialEmitter = new InitialEmitter(config.withObjectType);
    this.withObjectTypesSpec = createWithObjectTypesSpec(config.withObjectType);
    this.inputObjectTypeDefinitionFactory = new InputObjectTypeDefinitionFactory(
      config,
      this.registry,
      this.visitorFactory
    );
    this.enumTypeDefinitionFactory = new EnumTypeDefinitionFactory(config, this.registry, this.visitorFactory);
    this.unionTypesDefinitionFactory = new UnionTypesDefinitionFactory(
      this.registry,
      this.visitorFactory.createVisitor('output'),
      createWithObjectTypesSpec(config.withObjectType),
      createExportTypeStrategy(config.validationSchemaExportType)
    );
  }

  buildImports(): string[] {
    return this.importBuilder.build(this.registry.getTypes());
  }

  initialEmit(): string {
    return this.initialEmitter.emit(this.registry.getEnumDeclarations());
  }

  get InputObjectTypeDefinition() {
    return {
      leave: this.inputObjectTypeDefinitionFactory.create(),
    };
  }

  get ObjectTypeDefinition() {
    return {
      leave: (node: ObjectTypeDefinitionNode) => {
        if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node)) return;

        const visitor = this.visitorFactory.createVisitor('output');
        const name = visitor.convertName(node.name.value);
        this.registry.registerType(name);

        // Building schema for field arguments.
        const argumentBlocks = visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
          this.registry.registerType(typeName);
          return this.buildInputFields(field.arguments ?? [], visitor, typeName);
        });
        const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';

        // Building schema for fields.
        const shape =
          node.fields
            ?.map(field => {
              const fieldSchema = generateFieldYupSchema(this.config, visitor, field, 2);
              return isNonNullType(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
            })
            .join(',\n') ?? '';

        return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shape, appendArguments);
      },
    };
  }

  get EnumTypeDefinition() {
    return {
      leave: this.enumTypeDefinitionFactory.create(),
    };
  }

  get UnionTypeDefinition() {
    return {
      leave: this.unionTypesDefinitionFactory.create(),
    };
  }

  protected buildInputFields(
    fields: readonly (FieldDefinitionNode | InputValueDefinitionNode)[],
    visitor: Visitor,
    name: string
  ) {
    const shape = fields
      ?.map(field => {
        const fieldSchema = generateFieldYupSchema(this.config, visitor, field, 2);
        return isNonNullType(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
      })
      .join(',\n');

    return this.exportTypeStrategy.buildInputFields(shape, name);
  }
}

const generateFieldYupSchema = (
  config: ValidationSchemaPluginConfig,
  visitor: Visitor,
  field: InputValueDefinitionNode | FieldDefinitionNode,
  indentCount: number
): string => {
  const generatedCodesForDirectives = buildApi(
    field.name.value,
    config.rules ?? {},
    config.ignoreRules ?? [],
    field.directives ?? []
  );
  const gen = generateFieldTypeYupSchema(config, visitor, field.type, null, generatedCodesForDirectives);
  return indent(`${field.name.value}: ${maybeLazy(config, field.type, gen)}`, indentCount);
};

const generateFieldTypeYupSchema = (
  config: ValidationSchemaPluginConfig,
  visitor: Visitor,
  type: TypeNode,
  parentType: TypeNode | null,
  generatedCodesForDirectives: GeneratedCodesForDirectives
): string => {
  if (isListType(type)) {
    const gen = generateFieldTypeYupSchema(config, visitor, type.type, type, generatedCodesForDirectives);
    const nullable = !parentType || !isNonNullType(parentType);
    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    return `yup.array(${maybeLazy(config, type.type, `${gen}.defined()`)})${generatedCodesForDirectives.rulesForArray}${
      nullable ? '.nullable()' : '.defined()'
    }`;
  }
  if (isNonNullType(type)) {
    const gen = generateFieldTypeYupSchema(config, visitor, type.type, type, generatedCodesForDirectives);
    return maybeLazy(config, type.type, gen);
  }
  if (isNamedType(type)) {
    const gen = generateNameNodeYupSchema(config, visitor, type.name) + generatedCodesForDirectives.rules;
    if (!!parentType && isNonNullType(parentType)) {
      if (visitor.shouldEmitAsNotAllowEmptyString(type.name.value)) {
        return `${gen}.defined().required()`;
      }
      return `${gen}.defined().nonNullable()`;
    }
    const typ = visitor.getType(type.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      return `${gen}`;
    }
    return `${gen}.nullable()`;
  }
  console.warn('unhandled type:', type);
  return '';
};

const generateNameNodeYupSchema = (config: ValidationSchemaPluginConfig, visitor: Visitor, node: NameNode): string => {
  const converter = visitor.getNameNodeConverter(node);

  switch (converter?.targetKind) {
    case 'InputObjectTypeDefinition':
    case 'ObjectTypeDefinition':
    case 'UnionTypeDefinition':
    case 'EnumTypeDefinition':
      return createExportTypeStrategy(config.validationSchemaExportType).schemaEvaluation(
        `${converter.convertName()}Schema`,
        converter?.targetKind
      );
    default:
      return yup4Scalar(config, visitor, node.value);
  }
};

const maybeLazy = (config: ValidationSchemaPluginConfig, type: TypeNode, schema: string): string => {
  if (isNamedType(type) && isInput(type.name.value) && config.lazyTypes?.includes(type.name.value)) {
    // https://github.com/jquense/yup/issues/1283#issuecomment-786559444
    return `yup.lazy(() => ${schema})`;
  }
  return schema;
};

const yup4Scalar = (config: ValidationSchemaPluginConfig, visitor: Visitor, scalarName: string): string => {
  if (config.scalarSchemas?.[scalarName]) {
    return `${config.scalarSchemas[scalarName]}`;
  }
  const tsType = visitor.getScalarType(scalarName);
  switch (tsType) {
    case 'string':
      return `yup.string()`;
    case 'number':
      return `yup.number()`;
    case 'boolean':
      return `yup.boolean()`;
  }
  console.warn('unhandled name:', scalarName);
  return `yup.mixed()`;
};
