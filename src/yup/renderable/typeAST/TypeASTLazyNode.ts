import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTRenderer } from './TypeASTRenderer';
import { TypeASTTypeNode } from './TypeASTTypeNode';

export class TypeASTLazyNode implements TypeASTNode {
  constructor(private readonly child: TypeASTTypeNode) {}

  public getData() {
    return {
      child: this.child,
    };
  }

  public render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderLazy(this, fieldMetadata);
  }
}
