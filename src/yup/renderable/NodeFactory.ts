import { ListTypeNode, NamedTypeNode, TypeNode } from 'graphql';

import { isListType, isNamedType, isNonNullType } from '../../graphql';
import { FieldRenderer } from '../FieldRenderer';
import { Lazy } from './Lazy';
import { ListType } from './ListType';
import { NamedType } from './NamedType';
import { NullNode } from './NullNode';
import { Renderable } from './Renderable';

export class NodeFactory {
  constructor(private readonly fieldRenderer: FieldRenderer) {}

  public create(typeNode: TypeNode): Renderable {
    if (isNonNullType(typeNode)) {
      return this.helper(typeNode.type, true);
    }
    return this.helper(typeNode, false);
  }

  private helper(typeNode: ListTypeNode | NamedTypeNode, isNonNull: boolean): Renderable {
    if (isListType(typeNode)) {
      return new ListType(this.create(typeNode.type), isNonNull);
    }
    if (isNamedType(typeNode)) {
      if (this.fieldRenderer.isLazy(typeNode)) {
        return new Lazy(new NamedType(this.fieldRenderer, typeNode, isNonNull));
      }
      return new NamedType(this.fieldRenderer, typeNode, isNonNull);
    }
    return new NullNode(typeNode);
  }
}
