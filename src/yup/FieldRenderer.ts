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

type RenderResult = {
  rendered: string;
  isLazy: boolean;
};

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
    const gen = this.renderTopLevelField(field.type, generatedCodesForDirectives);
    // TODO: ここで特定のディレクティブの有無によりlazyを入れる
    return indent(`${field.name.value}: ${gen}`, indentCount);
  }

  private renderTopLevelField(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    const { isLazy, rendered } = this.handleAllType(typeNode, generatedCodesForDirectives);
    const maybeLazy = isLazy ? this.renderLazy(rendered) : rendered;
    return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
  }

  private handleAllType(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): RenderResult {
    if (isListType(typeNode)) {
      return this.renderList(typeNode.type, false, generatedCodesForDirectives);
    }
    if (isNonNullType(typeNode)) {
      return this.withNonNull(typeNode.type, generatedCodesForDirectives);
    }
    if (isNamedType(typeNode)) {
      return this.renderNamedType(typeNode, false, generatedCodesForDirectives);
    }
    console.warn('unhandled type:', typeNode);
    return {
      isLazy: false,
      rendered: '',
    };
  }

  // NonNull がネストすることはない
  // NonNull をどうレンダリングするかは子の型によって変わる
  private withNonNull(
    innerTypeNode: ListTypeNode | NamedTypeNode,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): RenderResult {
    if (isListType(innerTypeNode)) {
      return this.renderList(innerTypeNode.type, true, generatedCodesForDirectives);
    }
    if (isNamedType(innerTypeNode)) {
      return this.renderNamedType(innerTypeNode, true, generatedCodesForDirectives);
    }
    console.warn('unhandled type:', innerTypeNode);
    return {
      isLazy: false,
      rendered: '',
    };
  }

  // すべてが入りうる
  private renderList(
    innerTypeNode: TypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): RenderResult {
    const { isLazy, rendered } = this.handleAllType(innerTypeNode, generatedCodesForDirectives);

    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    const arrayContent = `${rendered}.defined()`;
    const maybeLazy = isLazy ? this.renderLazy(arrayContent) : arrayContent;
    const nullable = !isNonNull;
    return {
      isLazy: false,
      rendered: `yup.array(${maybeLazy})${generatedCodesForDirectives.rulesForArray}${
        nullable ? '.nullable()' : '.defined()'
      }`,
    };
  }

  // leaf. ends recursion
  private renderNamedType(
    typeNode: NamedTypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): RenderResult {
    const isLazy = this.isLazy(typeNode);
    const gen = this.generateNameNodeYupSchema(typeNode.name) + generatedCodesForDirectives.rules;
    if (isNonNull) {
      if (this.visitor.shouldEmitAsNotAllowEmptyString(typeNode.name.value, this.scalarDirection)) {
        return {
          isLazy,
          rendered: `${gen}.defined().required()`,
        };
      }
      return {
        isLazy,
        rendered: `${gen}.defined().nonNullable()`,
      };
    }
    const typ = this.visitor.getType(typeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      return {
        isLazy,
        rendered: `${gen}`,
      };
    }
    return {
      isLazy,
      rendered: `${gen}.nullable()`,
    };
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

  private isLazy(type: NamedTypeNode): boolean {
    return isInput(type.name.value) && !!this.config.lazyTypes?.includes(type.name.value);
  }

  private renderLazy(schema: string): string {
    return `yup.lazy(() => ${schema})`;
  }
}
