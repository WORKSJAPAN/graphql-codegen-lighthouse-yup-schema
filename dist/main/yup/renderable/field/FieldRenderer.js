"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldRenderer = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
class FieldRenderer {
    constructor(typeASTRenderer) {
        this.typeASTRenderer = typeASTRenderer;
    }
    renderField(field) {
        const { metadata, type } = field.getData();
        const renderedNode = type.render(this.typeASTRenderer, metadata);
        const { name } = metadata.getData();
        const maybeDefined = metadata.getData().isOptional ? renderedNode : defined(renderedNode);
        const maybeLazy = field.requiresLazy() ? lazy(maybeDefined) : maybeDefined;
        return (0, visitor_plugin_common_1.indent)(`${name}: ${maybeLazy}`, 2);
    }
}
exports.FieldRenderer = FieldRenderer;
function defined(content) {
    return `${content}.defined()`;
}
function lazy(content) {
    return `yup.lazy(() => ${content})`;
}
