import { TypeASTNode } from '../typeAST/TypeASTNode';
import { FieldMetadata } from './FieldMetadata';
import { FieldRenderer } from './FieldRenderer';

export class Field {
  constructor(
    private readonly metadata: FieldMetadata,
    private readonly schema: TypeASTNode
  ) {}

  public getData() {
    return {
      metadata: this.metadata,
      schema: this.schema,
    };
  }

  public render(fieldRenderer: FieldRenderer) {
    return fieldRenderer.renderField(this);
  }
}
