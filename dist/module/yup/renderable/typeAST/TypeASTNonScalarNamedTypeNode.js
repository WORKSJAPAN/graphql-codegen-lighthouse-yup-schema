export class TypeASTNonScalarNamedTypeNode {
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
    requiresLazy() {
        return this.data.requiresLazy;
    }
}
