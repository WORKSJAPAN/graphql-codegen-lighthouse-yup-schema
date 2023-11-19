import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, TypeNode } from 'graphql';

import { isNonNullType } from '../../graphql';
import { DirectiveRenderer, GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { NodeFactory } from './NodeFactory';
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
    const rendered = node.render();
    const isLazy = node.shouldBeLazy();
    const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(rendered) : rendered;
    return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
  }

  private createNode(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): Renderable {
    const nodeFactory = new NodeFactory(this.fieldRenderer, new FieldMetadata(generatedCodesForDirectives));
    return nodeFactory.create(typeNode);
  }
}
