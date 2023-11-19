import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, TypeNode } from 'graphql';

import { isNonNullType } from '../../graphql';
import { DirectiveRenderer, GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { NodeFactory } from './NodeFactory';
import { renderLazy } from './utils';

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

  private renderTopLevelField(typeNode: TypeNode, generatedCodesForDirectives: GeneratedCodesForDirectives): string {
    const nodeFactory = new NodeFactory(this.fieldRenderer, new FieldMetadata(generatedCodesForDirectives));
    const node = nodeFactory.create(typeNode);

    const rendered = node.render();
    const isLazy = node.shouldBeLazy();
    const maybeLazy = isLazy ? renderLazy(rendered) : rendered;
    return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
  }
}
