import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import {
  EnumTypeDefinitionNode,
  FieldDefinitionNode,
  GraphQLSchema,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  NameNode,
  ObjectTypeDefinitionNode,
  TypeNode,
  UnionTypeDefinitionNode,
} from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { buildApi, GeneratedCodesForDirectives } from '../directive';
import { Interpreter, NewVisitor } from '../types';
import { Visitor } from '../visitor';
import { VisitorFactory } from '../VisitorFactory';
import { isInput, isListType, isNamedType, isNonNullType, ObjectTypeDefinitionBuilder } from './../graphql';
import { EnumDeclarationStrategy } from './enumDeclarationStrategy/EnumDeclarationStrategy';
import { createEnumExportStrategy } from './enumDeclarationStrategy/factory';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ImportBuilder } from './ImportBuilder';

export class YupSchemaVisitor implements NewVisitor, Interpreter {
  private exportTypeStrategy: ExportTypeStrategy;
  private enumExportStrategy: EnumDeclarationStrategy;
  private visitorFactory: VisitorFactory;
  private enumDeclarations: string[] = [];
  private importBuilder: ImportBuilder;

  constructor(
    schema: GraphQLSchema,
    private readonly config: ValidationSchemaPluginConfig
  ) {
    this.visitorFactory = new VisitorFactory(schema, config);
    this.exportTypeStrategy = createExportTypeStrategy(config.validationSchemaExportType);
    this.enumExportStrategy = createEnumExportStrategy(config.enumsAsTypes, this.createVisitor('both'));
    this.importBuilder = new ImportBuilder(config.importFrom, config.useTypeImports);
  }

  buildImports(): string[] {
    return this.importBuilder.build();
  }

  protected buildObjectTypeDefinitionArguments(node: ObjectTypeDefinitionNode, visitor: Visitor) {
    return visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
      this.importBuilder.registerType(typeName);
      return this.buildInputFields(field.arguments ?? [], visitor, typeName);
    });
  }

  createVisitor(scalarDirection: 'input' | 'output' | 'both'): Visitor {
    return this.visitorFactory.createVisitor(scalarDirection);
  }

  initialEmit(): string {
    if (!this.config.withObjectType) return '\n' + this.enumDeclarations.join('\n');
    return '\n' + this.enumDeclarations.join('\n') + '\n' + this.unionFunctionDeclaration();
  }

  private unionFunctionDeclaration(): string {
    return new DeclarationBlock({})
      .asKind('function')
      .withName('union<T extends {}>(...schemas: ReadonlyArray<yup.Schema<T>>): yup.MixedSchema<T>')
      .withBlock(
        [
          indent('return yup.mixed<T>().test({'),
          indent('test: (value) => schemas.some((schema) => schema.isValidSync(value))', 2),
          indent('}).defined()'), // HACK: 型を合わせるために、union は undefined を許容しないこととした。問題が出たら考える。
        ].join('\n')
      ).string;
  }

  get InputObjectTypeDefinition() {
    return {
      leave: (node: InputObjectTypeDefinitionNode) => {
        const visitor = this.createVisitor('input');
        const name = visitor.convertName(node.name.value);
        this.importBuilder.registerType(name);
        return this.buildInputFields(node.fields ?? [], visitor, name);
      },
    };
  }

  get ObjectTypeDefinition() {
    return {
      leave: ObjectTypeDefinitionBuilder(this.config.withObjectType, (node: ObjectTypeDefinitionNode) => {
        const visitor = this.createVisitor('output');
        const name = visitor.convertName(node.name.value);
        this.importBuilder.registerType(name);

        // Building schema for field arguments.
        const argumentBlocks = this.buildObjectTypeDefinitionArguments(node, visitor);
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
      }),
    };
  }

  get EnumTypeDefinition() {
    return {
      leave: (node: EnumTypeDefinitionNode) => {
        const visitor = this.createVisitor('both');
        const enumName = visitor.convertName(node.name.value);
        const enumDeclaration = this.enumExportStrategy.enumDeclaration(enumName, node.values ?? []);
        this.importBuilder.registerType(enumName);
        this.enumDeclarations.push(enumDeclaration);
      },
    };
  }

  get UnionTypeDefinition() {
    return {
      leave: (node: UnionTypeDefinitionNode) => {
        if (!node.types || !this.config.withObjectType) return;
        const visitor = this.createVisitor('output');

        const unionName = visitor.convertName(node.name.value);
        this.importBuilder.registerType(unionName);

        const unionElements = node.types
          ?.map(t => {
            const element = visitor.convertName(t.name.value);
            const typ = visitor.getType(t.name.value);

            return this.exportTypeStrategy.schemaEvaluation(`${element}Schema`, typ?.astNode?.kind);
          })
          .join(', ');

        return this.exportTypeStrategy.unionTypeDefinition(unionName, unionElements);
      },
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
