export class TypeASTNullability {
    child;
    isNonNull;
    constructor(child, isNonNull) {
        this.child = child;
        this.isNonNull = isNonNull;
    }
    getData() {
        return {
            child: this.child,
            isNonNull: this.isNonNull,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderNullability(this, fieldMetadata);
    }
    requiresLazy() {
        return this.child.requiresLazy();
    }
}
