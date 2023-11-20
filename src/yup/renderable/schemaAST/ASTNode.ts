import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';

export interface ASTNode {
  render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata): string;
}
