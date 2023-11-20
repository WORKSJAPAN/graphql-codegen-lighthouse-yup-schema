import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';

export interface Renderable {
  render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata): string;
}
