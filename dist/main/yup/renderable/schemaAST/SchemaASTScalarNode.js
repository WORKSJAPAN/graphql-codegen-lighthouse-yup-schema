"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTScalarNode = void 0;
class SchemaASTScalarNode {
    constructor(graphQLTypeName, tsTypeName, isNonNull, isDefined) {
        this.graphQLTypeName = graphQLTypeName;
        this.tsTypeName = tsTypeName;
        this.isNonNull = isNonNull;
        this.isDefined = isDefined;
    }
    getData() {
        return {
            graphQLTypeName: this.graphQLTypeName,
            tsTypeName: this.tsTypeName,
            isNonNull: this.isNonNull,
            isDefined: this.isDefined,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderScalar(this, fieldMetadata);
    }
}
exports.SchemaASTScalarNode = SchemaASTScalarNode;
