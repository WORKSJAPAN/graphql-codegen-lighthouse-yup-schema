import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { FieldRenderer } from '../../FieldRenderer';
import { Renderable } from '../Renderable';

export class Field {
  constructor(
    private readonly graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode,
    private readonly node: Renderable
  ) {}

  public getData() {
    return {
      graphQLFieldNode: this.graphQLFieldNode,
      node: this.node,
    };
  }

  public render(fieldRenderer: FieldRenderer) {
    return fieldRenderer.renderField(this);
  }
}
