import { ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { ASTLazyNode } from './ASTLazyNode';
import { ASTListNode } from './ASTListNode';
import { ASTNamedTypeNode } from './ASTNamedTypeNode';
import { ASTNode } from './ASTNode';
import { ASTNullNode } from './ASTNullNode';

export class ASTNodeFactory {
  constructor(private readonly lazyTypes: readonly string[] = []) {}

  public create(graphQLTypeNode: TypeNode, isDefined: boolean = false): ASTNode {
    if (isNonNullType(graphQLTypeNode)) {
      return this.helper(graphQLTypeNode.type, true, isDefined);
    }
    return this.helper(graphQLTypeNode, false, isDefined);
  }

  private helper(graphQLTypeNode: ListTypeNode | NamedTypeNode, isNonNull: boolean, isDefined: boolean): ASTNode {
    if (isListType(graphQLTypeNode)) {
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return new ASTListNode(this.create(graphQLTypeNode.type, true), isNonNull, isDefined);
    }
    if (isNamedType(graphQLTypeNode)) {
      const ret = new ASTNamedTypeNode(graphQLTypeNode, isNonNull, isDefined);
      return this.isLazy(graphQLTypeNode) ? new ASTLazyNode(ret) : ret;
    }
    return new ASTNullNode(graphQLTypeNode);
  }

  private isLazy(graphQLTypeNode: NamedTypeNode): boolean {
    return isInput(graphQLTypeNode.name.value) && this.lazyTypes.includes(graphQLTypeNode.name.value);
  }
}
