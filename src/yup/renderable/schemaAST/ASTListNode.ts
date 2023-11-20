import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';
import { ASTLazyNode } from './ASTLazyNode';
import { AstTypeNode } from './AstTypeNode';

export class ASTListNode implements AstTypeNode {
  constructor(
    private readonly child: AstTypeNode | ASTLazyNode,
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
