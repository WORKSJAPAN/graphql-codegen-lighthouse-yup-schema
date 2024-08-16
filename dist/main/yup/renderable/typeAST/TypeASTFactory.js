"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeASTFactory = void 0;
const graphql_1 = require("graphql");
const graphql_2 = require("../../../graphql");
const TypeASTListNode_1 = require("./TypeASTListNode");
const TypeASTNonScalarNamedTypeNode_1 = require("./TypeASTNonScalarNamedTypeNode");
const TypeASTNullability_1 = require("./TypeASTNullability");
const TypeASTScalarNode_1 = require("./TypeASTScalarNode");
class TypeASTFactory {
    constructor(lazyTypes = [], scalarDirection, visitor) {
        this.lazyTypes = lazyTypes;
        this.scalarDirection = scalarDirection;
        this.visitor = visitor;
    }
    create(graphQLTypeNode) {
        if ((0, graphql_2.isNonNullType)(graphQLTypeNode)) {
            return new TypeASTNullability_1.TypeASTNullability(this.createForListOrNamedType(graphQLTypeNode.type), true);
        }
        return new TypeASTNullability_1.TypeASTNullability(this.createForListOrNamedType(graphQLTypeNode), false);
    }
    createForListOrNamedType(graphQLTypeNode) {
        if ((0, graphql_2.isListType)(graphQLTypeNode)) {
            // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
            return new TypeASTListNode_1.TypeASTListNode(this.create(graphQLTypeNode.type));
        }
        if ((0, graphql_2.isNamedType)(graphQLTypeNode)) {
            return this.createFromNamedTypeNode(graphQLTypeNode);
        }
        return assertNever(graphQLTypeNode);
    }
    createFromNamedTypeNode(graphQLTypeNode) {
        const graphQLTypeName = graphQLTypeNode.name.value;
        const kind = this.visitor.getKind(graphQLTypeName);
        if (kind === null || kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION) {
            return new TypeASTScalarNode_1.TypeASTScalarNode(graphQLTypeName, this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection));
        }
        return new TypeASTNonScalarNamedTypeNode_1.TypeASTNonScalarNamedTypeNode({
            graphQLTypeName,
            convertedName: this.visitor.convertName(graphQLTypeName),
            kind,
            tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
            requiresLazy: this.requiresLazy(graphQLTypeName),
        });
    }
    requiresLazy(graphQLTypeName) {
        return (0, graphql_2.isInput)(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
    }
}
exports.TypeASTFactory = TypeASTFactory;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_arg) {
    throw new Error('unreachable');
}
