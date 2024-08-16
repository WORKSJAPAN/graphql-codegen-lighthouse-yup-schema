import { Kind } from 'graphql';
import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { TypeASTListNode } from './TypeASTListNode';
import { TypeASTNonScalarNamedTypeNode } from './TypeASTNonScalarNamedTypeNode';
import { TypeASTNullability } from './TypeASTNullability';
import { TypeASTScalarNode } from './TypeASTScalarNode';
export class TypeASTFactory {
    lazyTypes;
    scalarDirection;
    visitor;
    constructor(lazyTypes = [], scalarDirection, visitor) {
        this.lazyTypes = lazyTypes;
        this.scalarDirection = scalarDirection;
        this.visitor = visitor;
    }
    create(graphQLTypeNode) {
        if (isNonNullType(graphQLTypeNode)) {
            return new TypeASTNullability(this.createForListOrNamedType(graphQLTypeNode.type), true);
        }
        return new TypeASTNullability(this.createForListOrNamedType(graphQLTypeNode), false);
    }
    createForListOrNamedType(graphQLTypeNode) {
        if (isListType(graphQLTypeNode)) {
            // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
            return new TypeASTListNode(this.create(graphQLTypeNode.type));
        }
        if (isNamedType(graphQLTypeNode)) {
            return this.createFromNamedTypeNode(graphQLTypeNode);
        }
        return assertNever(graphQLTypeNode);
    }
    createFromNamedTypeNode(graphQLTypeNode) {
        const graphQLTypeName = graphQLTypeNode.name.value;
        const kind = this.visitor.getKind(graphQLTypeName);
        if (kind === null || kind === Kind.SCALAR_TYPE_DEFINITION) {
            return new TypeASTScalarNode(graphQLTypeName, this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection));
        }
        return new TypeASTNonScalarNamedTypeNode({
            graphQLTypeName,
            convertedName: this.visitor.convertName(graphQLTypeName),
            kind,
            tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
            requiresLazy: this.requiresLazy(graphQLTypeName),
        });
    }
    requiresLazy(graphQLTypeName) {
        return isInput(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
    }
}
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_arg) {
    throw new Error('unreachable');
}
