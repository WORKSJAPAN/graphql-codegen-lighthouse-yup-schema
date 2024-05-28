export class TypeASTScalarNode {
    graphQLTypeName;
    tsTypeName;
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
