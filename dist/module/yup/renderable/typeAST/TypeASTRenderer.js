import { Kind } from 'graphql';
export class TypeASTRenderer {
    config;
    ruleASTRenderer;
    exportTypeStrategy;
    constructor(config, ruleASTRenderer, exportTypeStrategy) {
        this.config = config;
        this.ruleASTRenderer = ruleASTRenderer;
        this.exportTypeStrategy = exportTypeStrategy;
    }
    renderList(list, fieldMetadata) {
        const { child } = list.getData();
        const rendered = child.render(this, fieldMetadata);
        const renderedRule = fieldMetadata.getData().ruleForArray.render(this.ruleASTRenderer);
        return `yup.array(${rendered}.defined())${this.renderMeta(fieldMetadata)}${renderedRule}`;
    }
    renderNonScalarNamedType(namedType, fieldMetadata) {
        return `${this.doRenderNonScalarNamedType(namedType)}${this.renderMeta(fieldMetadata)}${fieldMetadata
            .getData()
            .rule.render(this.ruleASTRenderer)}`;
    }
    renderScalar(scalarType, fieldMetadata) {
        return `${this.doRenderScalar(scalarType)}${this.renderMeta(fieldMetadata)}${fieldMetadata
            .getData()
            .rule.render(this.ruleASTRenderer)}`;
    }
    doRenderScalar(scalarType) {
        const { graphQLTypeName, tsTypeName } = scalarType.getData();
        const scalarSchemas = this.config.scalarSchemas ?? {};
        if (scalarSchemas[graphQLTypeName]) {
            return `${scalarSchemas[graphQLTypeName]}`;
        }
        switch (tsTypeName) {
            case 'string':
                return `yup.string()`;
            case 'number':
                return `yup.number()`;
            case 'boolean':
                return `yup.boolean()`;
        }
        console.warn('unhandled name:', graphQLTypeName);
        return `yup.mixed()`;
    }
    doRenderNonScalarNamedType(schemaASTNonScalarNamedTypeNode) {
        const { kind, convertedName } = schemaASTNonScalarNamedTypeNode.getData();
        switch (kind) {
            case Kind.INPUT_OBJECT_TYPE_DEFINITION:
            case Kind.OBJECT_TYPE_DEFINITION:
            case Kind.UNION_TYPE_DEFINITION:
            case Kind.ENUM_TYPE_DEFINITION:
                return this.exportTypeStrategy.schemaEvaluation(`${convertedName}Schema`, kind);
            default:
                return assertsNeverKind(kind);
        }
    }
    renderMeta(fieldMetadata) {
        const label = fieldMetadata.getData().label;
        return label ? `.label(${JSON.stringify(label)})` : '';
    }
    renderNullability(nullability, fieldMetadata) {
        const { child, isNonNull } = nullability.getData();
        const rendered = child.render(this, fieldMetadata);
        return isNonNull ? `${rendered}.nonNullable()` : `${rendered}.nullable()`;
    }
}
function assertsNeverKind(kind) {
    throw new Error(`unexpected kind: ${kind}`);
}
