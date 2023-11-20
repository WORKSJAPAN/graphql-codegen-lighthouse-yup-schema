import { ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';
import { SchemaASTNode } from './SchemaASTNode';
import { SchemaASTNullNode } from './SchemaASTNullNode';

export class SchemaASTFactory {
  constructor(private readonly lazyTypes: readonly string[] = []) {}

  public create(graphQLTypeNode: TypeNode, isDefined: boolean = false): SchemaASTNode {
    if (isNonNullType(graphQLTypeNode)) {
      return this.helper(graphQLTypeNode.type, true, isDefined);
    }
    return this.helper(graphQLTypeNode, false, isDefined);
  }

  private helper(graphQLTypeNode: ListTypeNode | NamedTypeNode, isNonNull: boolean, isDefined: boolean): SchemaASTNode {
    if (isListType(graphQLTypeNode)) {
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return new SchemaASTListNode(this.create(graphQLTypeNode.type, true), isNonNull, isDefined);
    }
    if (isNamedType(graphQLTypeNode)) {
      const ret = new SchemaASTNamedTypeNode(graphQLTypeNode, isNonNull, isDefined);
      return this.isLazy(graphQLTypeNode) ? new SchemaASTLazyNode(ret) : ret;
    }
    return new SchemaASTNullNode(graphQLTypeNode);
  }

  private isLazy(graphQLTypeNode: NamedTypeNode): boolean {
    return isInput(graphQLTypeNode.name.value) && this.lazyTypes.includes(graphQLTypeNode.name.value);
  }
}
