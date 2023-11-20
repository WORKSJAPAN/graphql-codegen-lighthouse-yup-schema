"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTNonScalarNamedTypeNode = void 0;
class SchemaASTNonScalarNamedTypeNode {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return Object.assign({}, this.data);
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderNonScalarNamedType(this, fieldMetadata);
    }
}
exports.SchemaASTNonScalarNamedTypeNode = SchemaASTNonScalarNamedTypeNode;
