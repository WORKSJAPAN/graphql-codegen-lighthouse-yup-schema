"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldRenderer = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
class FieldRenderer {
    constructor(schemaASTRenderer) {
        this.schemaASTRenderer = schemaASTRenderer;
    }
    renderField(field) {
        const { metadata, schema } = field.getData();
        const renderedNode = schema.render(this.schemaASTRenderer, metadata);
        const { name } = metadata.getData();
        const gen = metadata.getData().isOptional ? `${renderedNode}.optional()` : renderedNode;
        return (0, visitor_plugin_common_1.indent)(`${name}: ${gen}`, 2);
    }
}
exports.FieldRenderer = FieldRenderer;
