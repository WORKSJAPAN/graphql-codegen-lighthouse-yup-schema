import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class ListType implements Renderable, AstTypeNode {
  constructor(
    private readonly child: Renderable,
    private readonly isNonNull: boolean,
    private readonly isDefined: boolean
  ) {}

  public getData() {
    return {
      child: this.child,
      isNonNull: this.isNonNull,
      isDefined: this.isDefined,
    };
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderList(this, fieldMetadata);
  }
}
