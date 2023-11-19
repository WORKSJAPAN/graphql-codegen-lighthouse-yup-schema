import { FieldMetadata } from './FieldMetadata';

export interface Renderable {
  render(fieldMetadata: FieldMetadata): string;
  shouldBeLazy(fieldMetadata: FieldMetadata): boolean;
}
