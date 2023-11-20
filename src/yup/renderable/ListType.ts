import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class ListType implements Renderable, AstTypeNode {
  constructor(
    private readonly child: Renderable,
    private readonly isNonNull: boolean,
    private readonly isDefined: boolean
  ) {}

  public render(fieldMetadata: FieldMetadata) {
    const rendered = this.child.render(fieldMetadata);

    return `yup.array(${rendered})${fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
      this.isNonNull ? '.defined()' : '.nullable()'
    }${this.isDefined ? '.defined()' : ''}`;
    // TODO: defined() がいっぱいついてしまうの直す
  }
}
