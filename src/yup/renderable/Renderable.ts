import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './field/FieldMetadata';

export interface Renderable {
  render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata): string;
}
