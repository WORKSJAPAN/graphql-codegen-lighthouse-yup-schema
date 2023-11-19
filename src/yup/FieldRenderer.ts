import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, NameNode, TypeNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { buildApi, GeneratedCodesForDirectives } from '../directive';
import { isInput, isListType, isNamedType, isNonNullType } from '../graphql';
import { Visitor } from '../visitor';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ScalarRenderer } from './ScalarRenderer';

export class FieldRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly visitor: Visitor,
    private readonly scalarRenderer: ScalarRenderer
  ) {}

  public renderInputFieldsShape(fields: readonly InputValueDefinitionNode[], name: string) {
    const shape = this.renderFieldsShapeContent(fields);

    return this.exportTypeStrategy.buildInputFields(shape, name);
  }

  public renderFieldsShapeContent(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]) {
    return fields
      ?.map(field => {
        return this.renderField(field, 2);
      })
      .join(',\n');
  }

  private renderField(field: InputValueDefinitionNode | FieldDefinitionNode, indentCount: number): string {
    const generatedCodesForDirectives = buildApi(
      field.name.value,
      this.config.rules ?? {},
      this.config.ignoreRules ?? [],
      field.directives ?? []
    );
    const gen = this.generateFieldTypeYupSchema(field.type, null, generatedCodesForDirectives);
    const ret = indent(`${field.name.value}: ${this.maybeLazy(field.type, gen)}`, indentCount);
    return isNonNullType(field.type) ? ret : `${ret}.optional()`;
  }

  private generateFieldTypeYupSchema(
    type: TypeNode,
    parentType: TypeNode | null,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    if (isListType(type)) {
      const gen = this.generateFieldTypeYupSchema(type.type, type, generatedCodesForDirectives);
      const nullable = !parentType || !isNonNullType(parentType);
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return `yup.array(${this.maybeLazy(type.type, `${gen}.defined()`)})${generatedCodesForDirectives.rulesForArray}${
        nullable ? '.nullable()' : '.defined()'
      }`;
    }
    if (isNonNullType(type)) {
      const gen = this.generateFieldTypeYupSchema(type.type, type, generatedCodesForDirectives);
      return this.maybeLazy(type.type, gen);
    }
    if (isNamedType(type)) {
      const gen = this.generateNameNodeYupSchema(type.name) + generatedCodesForDirectives.rules;
      if (!!parentType && isNonNullType(parentType)) {
        if (this.visitor.shouldEmitAsNotAllowEmptyString(type.name.value)) {
          return `${gen}.defined().required()`;
        }
        return `${gen}.defined().nonNullable()`;
      }
      const typ = this.visitor.getType(type.name.value);
      if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
        return `${gen}`;
      }
      return `${gen}.nullable()`;
    }
    console.warn('unhandled type:', type);
    return '';
  }

  private generateNameNodeYupSchema(node: NameNode): string {
    const converter = this.visitor.getNameNodeConverter(node);

    switch (converter?.targetKind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return createExportTypeStrategy(this.config.validationSchemaExportType).schemaEvaluation(
          `${converter.convertName()}Schema`,
          converter?.targetKind
        );
      default:
        return this.scalarRenderer.render(node.value);
    }
  }

  private maybeLazy(type: TypeNode, schema: string): string {
    if (isNamedType(type) && isInput(type.name.value) && this.config.lazyTypes?.includes(type.name.value)) {
      // https://github.com/jquense/yup/issues/1283#issuecomment-786559444
      return `yup.lazy(() => ${schema})`;
    }
    return schema;
  }
}
