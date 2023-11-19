import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { DirectiveRenderer } from './DirectiveRenderer';
import { FieldRenderer } from './FieldRenderer';
import { Field } from './renderable/Field';
import { NodeFactory } from './renderable/NodeFactory';

export class ShapeRenderer {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly directiveRenderer: DirectiveRenderer,
    private readonly nodeFactory: NodeFactory
  ) {}

  public render(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]) {
    return fields
      ?.map(field => {
        const node = this.nodeFactory.create(field.type);
        const astField = new Field(this.fieldRenderer, this.directiveRenderer, field, node);
        return astField.render();
      })
      .join(',\n');
  }
}
