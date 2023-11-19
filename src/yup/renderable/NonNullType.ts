import { NonNullTypeNode } from 'graphql';

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
    return this.fieldRenderer.withNonNull(this.nonNullTypeNode.type, this.generatedCodesForDirectives);
  }
}
