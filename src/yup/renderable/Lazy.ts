import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class Lazy implements Renderable {
  constructor(private readonly child: AstTypeNode) {}

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderLazy(this.child.render(fieldRenderer, fieldMetadata));
  }
}
