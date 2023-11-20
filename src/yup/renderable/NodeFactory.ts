import { ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isInput, isListType, isNamedType, isNonNullType } from '../../graphql';
import { FieldRenderer } from '../FieldRenderer';
import { Lazy } from './Lazy';
import { ListType } from './ListType';
import { NamedType } from './NamedType';
import { NullNode } from './NullNode';
import { Renderable } from './Renderable';

export class NodeFactory {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly lazyTypes: readonly string[] = []
  ) {}

  public create(typeNode: TypeNode, isDefined: boolean = false): Renderable {
    // TODO: ここで特定のディレクティブの有無によりlazyを入れる

    if (isNonNullType(typeNode)) {
      return this.helper(typeNode.type, true, isDefined);
    }
    return this.helper(typeNode, false, isDefined);
  }

  private helper(typeNode: ListTypeNode | NamedTypeNode, isNonNull: boolean, isDefined: boolean): Renderable {
    if (isListType(typeNode)) {
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return new ListType(this.create(typeNode.type, true), isNonNull, isDefined);
    }
    if (isNamedType(typeNode)) {
      const ret = new NamedType(typeNode, isNonNull, isDefined);
      return this.isLazy(typeNode) ? new Lazy(ret) : ret;
    }
    return new NullNode(typeNode);
  }

  private isLazy(type: NamedTypeNode): boolean {
    return isInput(type.name.value) && this.lazyTypes.includes(type.name.value);
  }
}
