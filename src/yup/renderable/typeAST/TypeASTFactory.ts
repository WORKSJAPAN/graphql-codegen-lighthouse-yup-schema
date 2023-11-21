import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { Kind, ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { Visitor } from '../../../visitor';
import { TypeASTListNode } from './TypeASTListNode';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTNonScalarNamedTypeNode } from './TypeASTNonScalarNamedTypeNode';
import { TypeASTScalarNode } from './TypeASTScalarNode';

export class TypeASTFactory {
  constructor(
    private readonly lazyTypes: readonly string[] = [],
    private readonly scalarDirection: keyof NormalizedScalarsMap[string],
    private readonly visitor: Visitor
  ) {}

  public create(graphQLTypeNode: TypeNode, isDefined: boolean = false): TypeASTNode {
    if (isNonNullType(graphQLTypeNode)) {
      return this.helper(graphQLTypeNode.type, true, isDefined);
    }
    return this.helper(graphQLTypeNode, false, isDefined);
  }

  private helper(graphQLTypeNode: ListTypeNode | NamedTypeNode, isNonNull: boolean, isDefined: boolean): TypeASTNode {
    if (isListType(graphQLTypeNode)) {
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return new TypeASTListNode(this.create(graphQLTypeNode.type, true), isNonNull, isDefined);
    }
    if (isNamedType(graphQLTypeNode)) {
      return this.createFromNamedTypeNode(graphQLTypeNode, isNonNull, isDefined);
    }
    return assertNever(graphQLTypeNode);
  }

  private createFromNamedTypeNode(
    graphQLTypeNode: NamedTypeNode,
    isNonNull: boolean,
    isDefined: boolean
  ): TypeASTNonScalarNamedTypeNode | TypeASTScalarNode {
    const graphQLTypeName = graphQLTypeNode.name.value;
    const kind = this.visitor.getKind(graphQLTypeName);

    if (kind === null || kind === Kind.SCALAR_TYPE_DEFINITION) {
      return new TypeASTScalarNode(
        graphQLTypeName,
        this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
        isNonNull,
        isDefined
      );
    }

    return new TypeASTNonScalarNamedTypeNode({
      graphQLTypeName,
      convertedName: this.visitor.convertName(graphQLTypeName),
      kind,
      tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
      isNonNull,
      isDefined,
      requiresLazy: this.requiresLazy(graphQLTypeName),
    });
  }

  private requiresLazy(graphQLTypeName: string): boolean {
    return isInput(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function assertNever(_arg: never): never {
  throw new Error('unreachable');
}
