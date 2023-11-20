export class SchemaASTLazyNode {
    child;
    constructor(child) {
        this.child = child;
    }
    getData() {
        return {
            child: this.child,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderLazy(this, fieldMetadata);
    }
}
