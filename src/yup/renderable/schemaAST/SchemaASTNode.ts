import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';

export interface SchemaASTNode {
  render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata): string;
}
