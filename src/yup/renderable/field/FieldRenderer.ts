import { indent } from '@graphql-codegen/visitor-plugin-common';

import { TypeASTRenderer } from '../typeAST/TypeASTRenderer';
import { Field } from './Field';

export class FieldRenderer {
  constructor(private readonly typeASTRenderer: TypeASTRenderer) {}

  public renderField(field: Field) {
    const { metadata, schema } = field.getData();
    const renderedNode = schema.render(this.typeASTRenderer, metadata);

    const { name } = metadata.getData();
    const gen = metadata.getData().isOptional ? `${renderedNode}.optional()` : renderedNode;
    return indent(`${name}: ${gen}`, 2);
  }
}
