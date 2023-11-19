import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { FieldRenderer } from './FieldRenderer';

export class ShapeRenderer {
  constructor(private readonly fieldRenderer: FieldRenderer) {}

  public render(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]) {
    return fields
      ?.map(field => {
        return this.fieldRenderer.render(field);
      })
      .join(',\n');
  }
}
