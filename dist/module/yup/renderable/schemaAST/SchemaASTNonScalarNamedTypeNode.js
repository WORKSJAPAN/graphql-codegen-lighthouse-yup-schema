export class SchemaASTNonScalarNamedTypeNode {
    data;
    constructor(data) {
        this.data = data;
    }
    getData() {
        return {
            ...this.data,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderNonScalarNamedType(this, fieldMetadata);
    }
}
