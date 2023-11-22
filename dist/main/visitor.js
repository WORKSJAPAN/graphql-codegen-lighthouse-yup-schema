"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Visitor = void 0;
const typescript_1 = require("@graphql-codegen/typescript");
const graphql_1 = require("graphql");
class Visitor extends typescript_1.TsVisitor {
    constructor(schema, pluginConfig) {
        super(schema, pluginConfig);
        this.schema = schema;
    }
    getKind(graphQLTypeName) {
        const foundType = this.schema.getType(graphQLTypeName);
        if (!foundType) {
            throw new Error(`type ${graphQLTypeName} not found in schema`);
        }
        // String 等の組み込みの scalar の場合、 astNode がない
        if (!foundType.astNode) {
            return null;
        }
        const kind = foundType.astNode.kind;
        assertsNotInterface(kind);
        return kind;
    }
    getTypeScriptScalarType(graphQLTypeName, scalarDirection) {
        var _a, _b;
        return (_b = (_a = this.scalars[graphQLTypeName]) === null || _a === void 0 ? void 0 : _a[scalarDirection]) !== null && _b !== void 0 ? _b : null;
    }
}
exports.Visitor = Visitor;
function assertsNotInterface(kind) {
    if (kind === graphql_1.Kind.INTERFACE_TYPE_DEFINITION) {
        throw new Error(`unexpected kind: ${kind}`);
    }
}
