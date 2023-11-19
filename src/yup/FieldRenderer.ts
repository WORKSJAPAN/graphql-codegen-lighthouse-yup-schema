import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, NamedTypeNode, NameNode, TypeNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { isInput, isListType, isNamedType, isNonNullType, isSpecifiedScalarName } from '../graphql';
import { Visitor } from '../visitor';
import { DirectiveRenderer, GeneratedCodesForDirectives } from './DirectiveRenderer';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { Field } from './renderable/Field';
import { ListType } from './renderable/ListType';
import { NonNullType } from './renderable/NonNullType';
import { ScalarRenderer } from './ScalarRenderer';

type RenderResult = {
  rendered: string;
  isLazy: boolean;
};

export class FieldRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly visitor: Visitor,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly directiveRenderer: DirectiveRenderer,
    private readonly scalarRenderer: ScalarRenderer,
    private readonly scalarDirection: keyof NormalizedScalarsMap[string]
  ) {}

  // object のトップレベルのフィールドのみ (入れ子は別の Schema 定数 or 関数となるため)
  public render(field: InputValueDefinitionNode | FieldDefinitionNode): string {
    const astField = new Field(this, this.directiveRenderer, field);

    return astField.render();
  }

  // temporarily public
  public handleAllType(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): RenderResult {
    if (isListType(typeNode)) {
      const renderable = new ListType(this, generatedCodesForDirectives, typeNode, false);
      return renderable.render();
    }
    if (isNonNullType(typeNode)) {
      const renderable = new NonNullType(this, generatedCodesForDirectives, typeNode);
      return renderable.render();
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

  // leaf. ends recursion
  public renderNamedType(
    typeNode: NamedTypeNode,
    isNonNull: boolean,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): RenderResult {
    const isLazy = this.isLazy(typeNode);
    const gen = this.generateNameNodeYupSchema(typeNode.name) + generatedCodesForDirectives.rules;
    if (isNonNull) {
      const rendered = this.shouldEmitAsNotAllowEmptyString(typeNode.name.value, this.scalarDirection)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;

      return {
        isLazy,
        rendered,
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
    const converter = this.getNameNodeConverter(node);

    switch (converter?.targetKind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return this.exportTypeStrategy.schemaEvaluation(`${converter.convertName()}Schema`, converter?.targetKind);
      default:
        return this.scalarRenderer.render(node.value, this.scalarDirection);
    }
  }

  private isLazy(type: NamedTypeNode): boolean {
    return isInput(type.name.value) && !!this.config.lazyTypes?.includes(type.name.value);
  }

  // temporarily public
  public renderLazy(schema: string): string {
    return `yup.lazy(() => ${schema})`;
  }

  private getNameNodeConverter(node: NameNode) {
    const typ = this.visitor.getType(node.value);
    const astNode = typ?.astNode;
    if (astNode === undefined || astNode === null) {
      return undefined;
    }
    return {
      targetKind: astNode.kind,
      convertName: () => this.visitor.convertName(astNode.name.value),
    };
  }

  private shouldEmitAsNotAllowEmptyString(name: string, scalarDirection: keyof NormalizedScalarsMap[string]): boolean {
    if (this.config.notAllowEmptyString !== true) {
      return false;
    }
    const typ = this.visitor.getType(name);
    if (typ?.astNode?.kind !== 'ScalarTypeDefinition' && !isSpecifiedScalarName(name)) {
      return false;
    }
    const tsType = this.visitor.getScalarType(name, scalarDirection);
    return tsType === 'string';
  }
}
