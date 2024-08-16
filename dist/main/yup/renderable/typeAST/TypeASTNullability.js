"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeASTNullability = void 0;
class TypeASTNullability {
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
exports.TypeASTNullability = TypeASTNullability;
