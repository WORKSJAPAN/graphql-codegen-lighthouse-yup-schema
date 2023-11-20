import { TsVisitor } from '@graphql-codegen/typescript';
import { Kind } from 'graphql';
export class Visitor extends TsVisitor {
    schema;
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
        return this.scalars[graphQLTypeName]?.[scalarDirection] ?? null;
    }
}
function assertsNotInterface(kind) {
    if (kind === Kind.INTERFACE_TYPE_DEFINITION) {
        throw new Error(`unexpected kind: ${kind}`);
    }
}
