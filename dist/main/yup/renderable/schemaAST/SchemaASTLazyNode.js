"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTLazyNode = void 0;
class SchemaASTLazyNode {
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
exports.SchemaASTLazyNode = SchemaASTLazyNode;
