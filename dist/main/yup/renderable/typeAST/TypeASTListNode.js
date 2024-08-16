"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeASTListNode = void 0;
class TypeASTListNode {
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
exports.TypeASTListNode = TypeASTListNode;
