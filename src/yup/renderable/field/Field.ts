import { FieldRenderer } from '../../FieldRenderer';
import { ASTNode } from '../schemaAST/ASTNode';
import { FieldMetadata } from './FieldMetadata';

export class Field {
  constructor(
    private readonly metadata: FieldMetadata,
    private readonly typeSchema: ASTNode
  ) {}

  public getData() {
    return {
      metadata: this.metadata,
      node: this.typeSchema,
    };
  }

  public render(fieldRenderer: FieldRenderer) {
    return fieldRenderer.renderField(this);
  }
}
