import { Kind } from 'graphql';
import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNonScalarNamedTypeNode } from './SchemaASTNonScalarNamedTypeNode';
import { SchemaASTNullNode } from './SchemaASTNullNode';
import { SchemaASTScalarNode } from './SchemaASTScalarNode';
export class SchemaASTFactory {
    lazyTypes;
    scalarDirection;
    visitor;
    constructor(lazyTypes = [], scalarDirection, visitor) {
        this.lazyTypes = lazyTypes;
        this.scalarDirection = scalarDirection;
        this.visitor = visitor;
    }
    create(graphQLTypeNode, isDefined = false) {
        if (isNonNullType(graphQLTypeNode)) {
            return this.helper(graphQLTypeNode.type, true, isDefined);
        }
        return this.helper(graphQLTypeNode, false, isDefined);
    }
    helper(graphQLTypeNode, isNonNull, isDefined) {
        if (isListType(graphQLTypeNode)) {
            // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
            return new SchemaASTListNode(this.create(graphQLTypeNode.type, true), isNonNull, isDefined);
        }
        if (isNamedType(graphQLTypeNode)) {
            return this.createFromNamedTypeNode(graphQLTypeNode, isNonNull, isDefined);
        }
        return new SchemaASTNullNode(graphQLTypeNode);
    }
    createFromNamedTypeNode(graphQLTypeNode, isNonNull, isDefined) {
        const graphQLTypeName = graphQLTypeNode.name.value;
        const kind = this.visitor.getKind(graphQLTypeName);
        if (kind === null || kind === Kind.SCALAR_TYPE_DEFINITION) {
            return new SchemaASTScalarNode(graphQLTypeName, this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection), isNonNull, isDefined);
        }
        const ret = new SchemaASTNonScalarNamedTypeNode({
            graphQLTypeName,
            convertedName: this.visitor.convertName(graphQLTypeName),
            kind,
            tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
            isNonNull,
            isDefined,
        });
        return this.isLazy(graphQLTypeName) ? new SchemaASTLazyNode(ret) : ret;
    }
    isLazy(graphQLTypeName) {
        return isInput(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
    }
}
