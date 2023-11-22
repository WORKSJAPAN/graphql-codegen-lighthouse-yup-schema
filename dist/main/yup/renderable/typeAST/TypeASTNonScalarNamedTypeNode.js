"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeASTNonScalarNamedTypeNode = void 0;
class TypeASTNonScalarNamedTypeNode {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return Object.assign({}, this.data);
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderNonScalarNamedType(this, fieldMetadata);
    }
    requiresLazy() {
        return this.data.requiresLazy;
    }
}
exports.TypeASTNonScalarNamedTypeNode = TypeASTNonScalarNamedTypeNode;
