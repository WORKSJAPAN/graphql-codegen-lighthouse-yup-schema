import { NamedTypeNode } from 'graphql';

import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class NamedType implements Renderable, AstTypeNode {
  constructor(
    readonly namedTypeNode: NamedTypeNode,
    readonly isNonNull: boolean,
    readonly isDefined: boolean
  ) {}

  public getData() {
    return {
      namedTypeNode: this.namedTypeNode,
      isNonNull: this.isNonNull,
      isDefined: this.isDefined,
    };
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderNamedType(this, fieldMetadata);
  }
}
