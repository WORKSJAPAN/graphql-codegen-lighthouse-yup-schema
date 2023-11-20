import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isInput, isListType, isNamedType, isNonNullType } from '../../../graphql';
import { Visitor } from '../../../visitor';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';
import { SchemaASTNode } from './SchemaASTNode';
import { SchemaASTNullNode } from './SchemaASTNullNode';

export class SchemaASTFactory {
  constructor(
    private readonly lazyTypes: readonly string[] = [],
    private readonly scalarDirection: keyof NormalizedScalarsMap[string],
    private readonly visitor: Visitor
  ) {}

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
      const graphQLTypeName = graphQLTypeNode.name.value;
      const ret = new SchemaASTNamedTypeNode({
        graphQLTypeName,
        convertedName: this.visitor.convertName(graphQLTypeName),
        kind: this.visitor.getKind(graphQLTypeName),
        tsTypeName: this.visitor.getTypeScriptScalarType(graphQLTypeName, this.scalarDirection),
        isNonNull,
        isDefined,
      });
      return this.isLazy(graphQLTypeName) ? new SchemaASTLazyNode(ret) : ret;
    }
    return new SchemaASTNullNode(graphQLTypeNode);
  }

  private isLazy(graphQLTypeName: string): boolean {
    return isInput(graphQLTypeName) && this.lazyTypes.includes(graphQLTypeName);
  }
}
