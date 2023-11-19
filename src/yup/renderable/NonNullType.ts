import { NonNullTypeNode } from 'graphql';

import { isListType, isNamedType } from '../../graphql';
import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { ListType } from './ListType';
import { NamedType } from './NamedType';
import { Renderable } from './Renderable';

export class NonNullType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly fieldMetadata: FieldMetadata,
    readonly nonNullTypeNode: NonNullTypeNode
  ) {}

  public render() {
    const innerNodeType = this.nonNullTypeNode.type;
    if (isListType(innerNodeType)) {
      const renderable = new ListType(this.fieldRenderer, this.fieldMetadata, innerNodeType, true);
      return renderable.render();
    }
    if (isNamedType(innerNodeType)) {
      const renderable = new NamedType(this.fieldRenderer, this.fieldMetadata, innerNodeType, true);
      return renderable.render();
    }
    console.warn('unhandled type:', innerNodeType);
    return {
      isLazy: false,
      rendered: '',
    };
  }
}
