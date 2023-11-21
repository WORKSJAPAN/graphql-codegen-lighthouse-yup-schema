import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTRenderer } from './TypeASTRenderer';
import { TypeASTTypeNode } from './TypeASTTypeNode';

export class TypeASTListNode implements TypeASTTypeNode {
  constructor(
    private readonly child: TypeASTTypeNode,
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
