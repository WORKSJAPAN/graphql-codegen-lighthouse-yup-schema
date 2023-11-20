import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './field/FieldMetadata';
import { Renderable } from './Renderable';

export class Lazy implements Renderable {
  constructor(private readonly child: AstTypeNode) {}

  public getData() {
    return {
      child: this.child,
    };
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderLazy(this, fieldMetadata);
  }
}
