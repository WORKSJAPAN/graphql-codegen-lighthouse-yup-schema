import { indent } from '@graphql-codegen/visitor-plugin-common';
export class FieldRenderer {
    schemaASTRenderer;
    constructor(schemaASTRenderer) {
        this.schemaASTRenderer = schemaASTRenderer;
    }
    renderField(field) {
        const { metadata, schema } = field.getData();
        const renderedNode = schema.render(this.schemaASTRenderer, metadata);
        const { name } = metadata.getData();
        const gen = metadata.getData().isOptional ? `${renderedNode}.optional()` : renderedNode;
        return indent(`${name}: ${gen}`, 2);
    }
}
