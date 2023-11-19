import { NonNullTypeNode } from 'graphql';

import { isListType, isNamedType } from '../../graphql';
import { GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { Renderable } from './Renderable';

export class NonNullType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly generatedCodesForDirectives: GeneratedCodesForDirectives,
    readonly nonNullTypeNode: NonNullTypeNode
  ) {}

  public render() {
    const innerNodeType = this.nonNullTypeNode.type;
    if (isListType(innerNodeType)) {
      return this.fieldRenderer.renderList(innerNodeType.type, true, this.generatedCodesForDirectives);
    }
    if (isNamedType(innerNodeType)) {
      return this.fieldRenderer.renderNamedType(innerNodeType, true, this.generatedCodesForDirectives);
    }
    console.warn('unhandled type:', innerNodeType);
    return {
      isLazy: false,
      rendered: '',
    };
  }
}
