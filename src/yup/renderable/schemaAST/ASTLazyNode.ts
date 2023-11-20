import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';
import { ASTNode } from './ASTNode';
import { AstTypeNode } from './AstTypeNode';

export class ASTLazyNode implements ASTNode {
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
