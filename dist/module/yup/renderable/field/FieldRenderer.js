import { indent } from '@graphql-codegen/visitor-plugin-common';
export class FieldRenderer {
    typeASTRenderer;
    constructor(typeASTRenderer) {
        this.typeASTRenderer = typeASTRenderer;
    }
    renderField(field) {
        const { metadata, type } = field.getData();
        const renderedNode = type.render(this.typeASTRenderer, metadata);
        const { name } = metadata.getData();
        const maybeDefined = metadata.getData().isOptional ? renderedNode : defined(renderedNode);
        const maybeLazy = field.requiresLazy() ? lazy(maybeDefined) : maybeDefined;
        return indent(`${name}: ${maybeLazy}`, 2);
    }
}
function defined(content) {
    return `${content}.defined()`;
}
function lazy(content) {
    return `yup.lazy(() => ${content})`;
}
