import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, TypeNode } from 'graphql';

import { isNonNullType } from '../../graphql';
import { DirectiveRenderer, GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { NonNullType } from './NonNullType';

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
    if (isNonNullType(typeNode)) {
      const renderable = new NonNullType(this.fieldRenderer, generatedCodesForDirectives, typeNode);
      const { isLazy, rendered } = renderable.render();
      const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(rendered) : rendered;
      return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
    }

    const { isLazy, rendered } = this.fieldRenderer.handleAllType(typeNode, generatedCodesForDirectives);
    const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(rendered) : rendered;
    return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
  }
}
