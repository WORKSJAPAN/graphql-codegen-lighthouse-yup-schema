"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTRenderer = void 0;
const graphql_1 = require("graphql");
const graphql_2 = require("../../../graphql");
class SchemaASTRenderer {
    constructor(config, ruleASTRenderer, exportTypeStrategy) {
        this.config = config;
        this.ruleASTRenderer = ruleASTRenderer;
        this.exportTypeStrategy = exportTypeStrategy;
    }
    renderLazy(lazy, fieldMetadata) {
        const { child } = lazy.getData();
        return `yup.lazy(() => ${child.render(this, fieldMetadata)})`;
    }
    renderList(list, fieldMetadata) {
        const { child, isNonNull, isDefined } = list.getData();
        const rendered = child.render(this, fieldMetadata);
        return `yup.array(${rendered})${fieldMetadata.getData().ruleForArray.render(this.ruleASTRenderer)}${isNonNull ? '.defined()' : '.nullable()'}${isDefined ? '.defined()' : ''}`;
    }
    renderNonScalarNamedType(namedType, fieldMetadata) {
        const { kind, isNonNull, isDefined } = namedType.getData();
        const gen = this.doRenderNonScalarNamedType(namedType) + fieldMetadata.getData().rule.render(this.ruleASTRenderer);
        if (isNonNull) {
            const ret = `${gen}.defined().nonNullable()`;
            return isDefined ? `${ret}.defined()` : `${ret}`;
        }
        // オブジェクトを入力する場合はnullable()をつけない (undefined なことはある)
        if (kind === graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION) {
            const ret = `${gen}`;
            return isDefined ? `${ret}.defined()` : `${ret}`;
        }
        const ret = `${gen}.nullable()`;
        return isDefined ? `${ret}.defined()` : `${ret}`;
    }
    renderScalar(scalarType, fieldMetadata) {
        const { isNonNull, isDefined } = scalarType.getData();
        const gen = this.doRenderScalar(scalarType) + fieldMetadata.getData().rule.render(this.ruleASTRenderer);
        if (isNonNull) {
            const ret = this.shouldEmitAsNotAllowEmptyString(scalarType)
                ? `${gen}.defined().required()`
                : `${gen}.defined().nonNullable()`;
            return isDefined ? `${ret}.defined()` : `${ret}`;
        }
        const ret = `${gen}.nullable()`;
        return isDefined ? `${ret}.defined()` : `${ret}`;
    }
    doRenderScalar(scalarType) {
        var _a;
        const { graphQLTypeName, tsTypeName } = scalarType.getData();
        const scalarSchemas = (_a = this.config.scalarSchemas) !== null && _a !== void 0 ? _a : {};
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
            case graphql_1.Kind.INPUT_OBJECT_TYPE_DEFINITION:
            case graphql_1.Kind.OBJECT_TYPE_DEFINITION:
            case graphql_1.Kind.UNION_TYPE_DEFINITION:
            case graphql_1.Kind.ENUM_TYPE_DEFINITION:
                return this.exportTypeStrategy.schemaEvaluation(`${convertedName}Schema`, kind);
            default:
                return assertsNeverKind(kind);
        }
    }
    shouldEmitAsNotAllowEmptyString(schemaASTScalarType) {
        if (this.config.notAllowEmptyString !== true) {
            return false;
        }
        const { graphQLTypeName, tsTypeName } = schemaASTScalarType.getData();
        if (!(0, graphql_2.isSpecifiedScalarName)(graphQLTypeName)) {
            return false;
        }
        return tsTypeName === 'string';
    }
}
exports.SchemaASTRenderer = SchemaASTRenderer;
function assertsNeverKind(kind) {
    throw new Error(`unexpected kind: ${kind}`);
}
