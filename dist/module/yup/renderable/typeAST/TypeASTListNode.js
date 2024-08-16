export class TypeASTListNode {
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
        return schemaASTRenderer.renderList(this, fieldMetadata);
    }
    requiresLazy() {
        return this.child.requiresLazy();
    }
}
