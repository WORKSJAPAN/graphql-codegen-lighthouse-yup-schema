export class SchemaASTNullNode {
    typeNode;
    constructor(typeNode) {
        this.typeNode = typeNode;
    }
    render() {
        console.warn('unhandled type:', this.typeNode);
        return '';
    }
}
