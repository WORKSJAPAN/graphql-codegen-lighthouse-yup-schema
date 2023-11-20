import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { ListTypeNode, NamedTypeNode, NameNode, TypeNode } from 'graphql';

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
      const ret = new SchemaASTNamedTypeNode({
        name: graphQLTypeNode.name.value,
        convertedName: this.convertedName(graphQLTypeNode.name),
        kind: this.visitor.getKind(graphQLTypeNode.name.value),
        tsType: this.visitor.getTypeScriptScalarType(graphQLTypeNode.name.value, this.scalarDirection),
        isNonNull,
        isDefined,
      });
      return this.isLazy(graphQLTypeNode) ? new SchemaASTLazyNode(ret) : ret;
    }
    return new SchemaASTNullNode(graphQLTypeNode);
  }

  private isLazy(graphQLTypeNode: NamedTypeNode): boolean {
    return isInput(graphQLTypeNode.name.value) && this.lazyTypes.includes(graphQLTypeNode.name.value);
  }

  private convertedName(graphQLNameNode: NameNode) {
    return this.getNameNodeConverter(graphQLNameNode)?.convertName() ?? null;
  }

  private getNameNodeConverter(node: NameNode) {
    this.visitor.getKind(node.value);
    return {
      convertName: () => this.visitor.convertName(node.value),
    };
  }
}
