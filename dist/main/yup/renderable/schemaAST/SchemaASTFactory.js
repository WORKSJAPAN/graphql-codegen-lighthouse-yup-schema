"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaASTFactory = void 0;
const graphql_1 = require("graphql");
const graphql_2 = require("../../../graphql");
const SchemaASTLazyNode_1 = require("./SchemaASTLazyNode");
const SchemaASTListNode_1 = require("./SchemaASTListNode");
const SchemaASTNonScalarNamedTypeNode_1 = require("./SchemaASTNonScalarNamedTypeNode");
const SchemaASTNullNode_1 = require("./SchemaASTNullNode");
const SchemaASTScalarNode_1 = require("./SchemaASTScalarNode");
class SchemaASTFactory {
    constructor(lazyTypes = [], scalarDirection, visitor) {
        this.lazyTypes = lazyTypes;
        this.scalarDirection = scalarDirection;
        this.visitor = visitor;
    }
    create(graphQLTypeNode, isDefined = false) {
        if ((0, graphql_2.isNonNullType)(graphQLTypeNode)) {
            return this.helper(graphQLTypeNode.type, true, isDefined);
        }
        return this.helper(graphQLTypeNode, false, isDefined);
    }
    helper(graphQLTypeNode, isNonNull, isDefined) {
        if ((0, graphql_2.isListType)(graphQLTypeNode)) {
            // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
            return new SchemaASTListNode_1.SchemaASTListNode(this.create(graphQLTypeNode.type, true), isNonNull, isDefined);
        }
        if ((0, graphql_2.isNamedType)(graphQLTypeNode)) {
            return this.createFromNamedTypeNode(graphQLTypeNode, isNonNull, isDefined);
        }
        return new SchemaASTNullNode_1.SchemaASTNullNode(graphQLTypeNode);
    }
    createFromNamedTypeNode(graphQLTypeNode, isNonNull, isDefined) {
        const graphQLTypeName = graphQLTypeNode.name.value;
        const kind = this.visitor.getKind(graphQLTypeName);
        if (kind === null || kind === graphql_1.Kind.SCALAR_TYPE_DEFINITION) {
            return new SchemaASTScalarNode_1.SchemaASTScalarNode(graphQLTypeName, this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection), isNonNull, isDefined);
        }
        const ret = new SchemaASTNonScalarNamedTypeNode_1.SchemaASTNonScalarNamedTypeNode({
            graphQLTypeName,
            convertedName: this.visitor.convertName(graphQLTypeName),
            kind,
            tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
            isNonNull,
            isDefined,
        });
        return this.isLazy(graphQLTypeName) ? new SchemaASTLazyNode_1.SchemaASTLazyNode(ret) : ret;
    }
    isLazy(graphQLTypeName) {
        return (0, graphql_2.isInput)(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
    }
}
exports.SchemaASTFactory = SchemaASTFactory;
