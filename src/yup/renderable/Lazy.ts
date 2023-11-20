import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class Lazy implements Renderable {
  constructor(private readonly child: AstTypeNode) {}

  public render(fieldMetadata: FieldMetadata) {
    return `yup.lazy(() => ${this.child.render(fieldMetadata)})`;
  }

  public shouldBeLazy(fieldMetadata: FieldMetadata): boolean {
    return false;
  }
}
