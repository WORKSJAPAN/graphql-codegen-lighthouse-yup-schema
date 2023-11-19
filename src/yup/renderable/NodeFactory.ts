import { TypeNode } from 'graphql';

import { isListType, isNamedType, isNonNullType } from '../../graphql';
import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { ListType } from './ListType';
import { NamedType } from './NamedType';
import { NonNullType } from './NonNullType';
import { NullRenderable } from './NullRenderer';
import { Renderable } from './Renderable';

export class NodeFactory {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly fieldMetadata: FieldMetadata
  ) {}

  public create(typeNode: TypeNode): Renderable {
    if (isListType(typeNode)) {
      return new ListType(this.fieldRenderer, this.fieldMetadata, this.create(typeNode.type), false);
    }
    if (isNonNullType(typeNode)) {
      return new NonNullType(this.fieldRenderer, this.fieldMetadata, typeNode);
    }
    if (isNamedType(typeNode)) {
      return new NamedType(this.fieldRenderer, this.fieldMetadata, typeNode, false);
    }
    return new NullRenderable(typeNode);
  }
}
