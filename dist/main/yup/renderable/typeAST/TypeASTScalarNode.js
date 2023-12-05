"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeASTScalarNode = void 0;
class TypeASTScalarNode {
    constructor(graphQLTypeName, tsTypeName) {
        this.graphQLTypeName = graphQLTypeName;
        this.tsTypeName = tsTypeName;
    }
    getData() {
        return {
            graphQLTypeName: this.graphQLTypeName,
            tsTypeName: this.tsTypeName,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderScalar(this, fieldMetadata);
    }
    requiresLazy() {
        return false;
    }
}
exports.TypeASTScalarNode = TypeASTScalarNode;
