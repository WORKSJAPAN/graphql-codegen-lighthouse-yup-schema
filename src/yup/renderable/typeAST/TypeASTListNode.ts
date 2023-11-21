import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTRenderer } from './TypeASTRenderer';

export class TypeASTListNode implements TypeASTNode {
  constructor(
    private readonly child: TypeASTNode,
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

  public render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderList(this, fieldMetadata);
  }

  public requiresLazy() {
    return this.child.requiresLazy();
  }
}
