"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTListNode = void 0;
class SchemaASTListNode {
    constructor(child, isNonNull, isDefined) {
        this.child = child;
        this.isNonNull = isNonNull;
        this.isDefined = isDefined;
    }
    getData() {
        return {
            child: this.child,
            isNonNull: this.isNonNull,
            isDefined: this.isDefined,
        };
    }
    render(schemaASTRenderer, fieldMetadata) {
        return schemaASTRenderer.renderList(this, fieldMetadata);
    }
}
exports.SchemaASTListNode = SchemaASTListNode;
