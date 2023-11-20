import { FieldRenderer } from '../../FieldRenderer';
import { Renderable } from '../Renderable';
import { FieldMetadata } from './FieldMetadata';

export class Field {
  constructor(
    private readonly metadata: FieldMetadata,
    private readonly node: Renderable
  ) {}

  public getData() {
    return {
      metadata: this.metadata,
      node: this.node,
    };
  }

  public render(fieldRenderer: FieldRenderer) {
    return fieldRenderer.renderField(this);
  }
}
