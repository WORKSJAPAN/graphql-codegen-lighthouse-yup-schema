import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, TypeNode } from 'graphql';

import { isListType, isNamedType, isNonNullType } from '../../graphql';
import { DirectiveRenderer, GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { ListType } from './ListType';
import { NamedType } from './NamedType';
import { NonNullType } from './NonNullType';
import { NullRenderable } from './NullRenderer';
import { Renderable } from './Renderable';

export class Field {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly directiveRenderer: DirectiveRenderer,
    private readonly field: InputValueDefinitionNode | FieldDefinitionNode
  ) {}

  public render() {
    const generatedCodesForDirectives = this.directiveRenderer.render(
      this.field.name.value,
      this.field.directives ?? []
    );
    const gen = this.renderTopLevelField(this.field.type, generatedCodesForDirectives);
    // TODO: ここで特定のディレクティブの有無によりlazyを入れる
    return indent(`${this.field.name.value}: ${gen}`, 2);
  }

  // temporarily public
  private renderTopLevelField(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    const node = this.createNode(typeNode, generatedCodesForDirectives);
    const { isLazy, rendered } = node.render();
    const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(rendered) : rendered;
    return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
  }

  private createNode(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): Renderable {
    if (isListType(typeNode)) {
      return new ListType(this.fieldRenderer, new FieldMetadata(generatedCodesForDirectives), typeNode, false);
    }
    if (isNonNullType(typeNode)) {
      return new NonNullType(this.fieldRenderer, new FieldMetadata(generatedCodesForDirectives), typeNode);
    }
    if (isNamedType(typeNode)) {
      return new NamedType(this.fieldRenderer, new FieldMetadata(generatedCodesForDirectives), typeNode, false);
    }
    return new NullRenderable(typeNode);
  }
}
