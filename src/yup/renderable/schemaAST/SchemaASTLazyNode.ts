import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTNode } from './SchemaASTNode';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';

export class SchemaASTLazyNode implements SchemaASTNode {
  constructor(private readonly child: SchemaASTTypeNode) {}

  public getData() {
    return {
      child: this.child,
    };
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderLazy(this, fieldMetadata);
  }
}
