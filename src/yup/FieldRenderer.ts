import { indent, NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import {
  FieldDefinitionNode,
  InputValueDefinitionNode,
  ListTypeNode,
  NamedTypeNode,
  NameNode,
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

  // object のトップレベルのフィールドのみ (入れ子は別の Schema 定数 or 関数となるため)
  public render(field: InputValueDefinitionNode | FieldDefinitionNode, indentCount: number): string {
    const generatedCodesForDirectives = buildApi(
      field.name.value,
      this.config.rules ?? {},
      this.config.ignoreRules ?? [],
      field.directives ?? []
    );
    const gen = this.handleTopLevelField(field.type, generatedCodesForDirectives);
    return indent(`${field.name.value}: ${gen}`, indentCount);
  }

  private handleTopLevelField(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    // TODO: ここで特定のディレクティブの有無によりlazyを入れる
    const ret = this.maybeLazy(typeNode, this.handleAllType(typeNode, generatedCodesForDirectives));
    return isNonNullType(typeNode) ? ret : `${ret}.optional()`;
  }

  private handleAllType(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    if (isListType(typeNode)) {
      return this.withList(typeNode.type, false, generatedCodesForDirectives);
    }
    if (isNonNullType(typeNode)) {
      return this.withNonNull(typeNode.type, generatedCodesForDirectives);
    }
    if (isNamedType(typeNode)) {
      return this.handleNamedType(typeNode, false, generatedCodesForDirectives);
    }
    console.warn('unhandled type:', typeNode);
    return '';
  }

  // NonNull がネストすることはない
  private withNonNull(
    innerTypeNode: ListTypeNode | NamedTypeNode,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    if (isListType(innerTypeNode)) {
      return this.maybeLazy(innerTypeNode, this.withList(innerTypeNode.type, true, generatedCodesForDirectives));
    }
    if (isNamedType(innerTypeNode)) {
      return this.maybeLazy(innerTypeNode, this.handleNamedType(innerTypeNode, true, generatedCodesForDirectives));
    }
    console.warn('unhandled type:', innerTypeNode);
    return '';
  }

  // すべてが入りうる
  private withList(
    innerTypeNode: TypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    const gen = this.handleAllType(innerTypeNode, generatedCodesForDirectives);
    const nullable = !isNonNull;
    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    return `yup.array(${this.maybeLazy(innerTypeNode, `${gen}.defined()`)})${
      generatedCodesForDirectives.rulesForArray
    }${nullable ? '.nullable()' : '.defined()'}`;
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
