import { indent } from '@graphql-codegen/visitor-plugin-common';
import {
  FieldDefinitionNode,
  InputObjectTypeDefinitionNode,
  InputValueDefinitionNode,
  NameNode,
  TypeNode,
} from 'graphql';

import { ValidationSchemaPluginConfig } from '../../config';
import { buildApi, GeneratedCodesForDirectives } from '../../directive';
import { isInput, isListType, isNamedType, isNonNullType } from '../../graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from '../exportTypeStrategies/factory';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';

export class InputObjectTypeDefinitionFactory implements VisitFunctionFactory<InputObjectTypeDefinitionNode> {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly registry: Registry,
    private readonly visitor: Visitor,
    private readonly exportTypeStrategy: ExportTypeStrategy
  ) {}

  create() {
    return (node: InputObjectTypeDefinitionNode) => {
      const name = this.visitor.convertName(node.name.value);
      this.registry.registerType(name);
      return this.buildInputFields(node.fields ?? [], this.visitor, name);
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
