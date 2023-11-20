"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTNullNode = void 0;
class SchemaASTNullNode {
    constructor(typeNode) {
        this.typeNode = typeNode;
    }
    render() {
        console.warn('unhandled type:', this.typeNode);
        return '';
    }
}
exports.SchemaASTNullNode = SchemaASTNullNode;
