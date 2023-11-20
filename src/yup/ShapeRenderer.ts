import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { FieldRenderer } from './FieldRenderer';
import { Field } from './renderable/Field';
import { NodeFactory } from './renderable/NodeFactory';

export class ShapeRenderer {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly nodeFactory: NodeFactory
  ) {}

  public render(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]) {
    return fields
      ?.map(field => {
        const node = this.nodeFactory.create(field.type);
        const astField = new Field(field, node);
        return astField.render(this.fieldRenderer);
      })
      .join(',\n');
  }
}
