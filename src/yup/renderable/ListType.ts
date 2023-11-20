import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class ListType implements Renderable, AstTypeNode {
  constructor(
    private readonly child: Renderable,
    private readonly _isNonNull: boolean,
    private readonly _isDefined: boolean
  ) {}

  public getChild() {
    return this.child;
  }

  public isNonNull() {
    return this._isNonNull;
  }

  public isDefined() {
    return this._isDefined;
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderList(this, fieldMetadata);
  }
}
