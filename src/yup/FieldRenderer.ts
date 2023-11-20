import { indent } from '@graphql-codegen/visitor-plugin-common';

import { Field } from './renderable/field/Field';
import { SchemaASTRenderer } from './renderable/schemaAST/SchemaASTRenderer';

export class FieldRenderer {
  constructor(private readonly schemaASTRenderer: SchemaASTRenderer) {}

  public renderField(field: Field) {
    const { metadata, schema } = field.getData();
    const renderedNode = schema.render(this.schemaASTRenderer, metadata);

    const { name } = metadata.getData();
    const gen = metadata.getData().isOptional ? `${renderedNode}.optional()` : renderedNode;
    return indent(`${name}: ${gen}`, 2);
  }
}
