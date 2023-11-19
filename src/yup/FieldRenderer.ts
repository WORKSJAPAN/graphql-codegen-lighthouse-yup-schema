import { indent, NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NameNode,
  NonNullTypeNode,
  TypeNode,
} from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { buildApi, GeneratedCodesForDirectives } from '../directive';
import { isInput, isListType, isNamedType, isNonNullType } from '../graphql';
import { Visitor } from '../visitor';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ScalarRenderer } from './ScalarRenderer';

export class FieldRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly visitor: Visitor,
    private readonly scalarRenderer: ScalarRenderer,
    private readonly scalarDirection: keyof NormalizedScalarsMap[string]
  ) {}

  public render(field: InputValueDefinitionNode | FieldDefinitionNode, indentCount: number): string {
    const generatedCodesForDirectives = buildApi(
      field.name.value,
      this.config.rules ?? {},
      this.config.ignoreRules ?? [],
      field.directives ?? []
    );
    const gen = this.entry(field.type, generatedCodesForDirectives);
    const ret = indent(`${field.name.value}: ${this.maybeLazy(field.type, gen)}`, indentCount);
    return isNonNullType(field.type) ? ret : `${ret}.optional()`;
  }

  private entry(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    return this.helper(typeNode, generatedCodesForDirectives);
  }

  private helper(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    if (isListType(typeNode)) {
      return this.handleListType(typeNode, false, generatedCodesForDirectives);
    }
    if (isNonNullType(typeNode)) {
      return this.handleNonNullType(typeNode, generatedCodesForDirectives);
    }
    if (isNamedType(typeNode)) {
      return this.handleNamedType(typeNode, false, generatedCodesForDirectives);
    }
    console.warn('unhandled type:', typeNode);
    return '';
  }

  private withNonNull(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    if (isListType(typeNode)) {
      return this.handleListType(typeNode, true, generatedCodesForDirectives);
    }
    if (isNamedType(typeNode)) {
      return this.handleNamedType(typeNode, true, generatedCodesForDirectives);
    }
    console.warn('unhandled type:', typeNode);
    return '';
  }

  private handleListType(
    typeNode: ListTypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    const gen = this.helper(typeNode.type, generatedCodesForDirectives);
    const nullable = !isNonNull;
    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    return `yup.array(${this.maybeLazy(typeNode.type, `${gen}.defined()`)})${
      generatedCodesForDirectives.rulesForArray
    }${nullable ? '.nullable()' : '.defined()'}`;
  }

  private handleNonNullType(
    typeNode: NonNullTypeNode,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    const gen = this.withNonNull(typeNode.type, generatedCodesForDirectives);
    return this.maybeLazy(typeNode.type, gen);
  }

  // leaf. ends recursion
  private handleNamedType(
    typeNode: NamedTypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    const gen = this.generateNameNodeYupSchema(typeNode.name) + generatedCodesForDirectives.rules;
    if (isNonNull) {
      if (this.visitor.shouldEmitAsNotAllowEmptyString(typeNode.name.value, this.scalarDirection)) {
        return `${gen}.defined().required()`;
      }
      return `${gen}.defined().nonNullable()`;
    }
    const typ = this.visitor.getType(typeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      return `${gen}`;
    }
    return `${gen}.nullable()`;
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
        return this.scalarRenderer.render(node.value, this.scalarDirection);
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
