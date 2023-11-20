import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';
import { renderLazy } from './utils';

export class ListType implements Renderable, AstTypeNode {
  constructor(
    private readonly child: Renderable,
    private readonly isNonNull: boolean,
    private readonly isDefined: boolean
  ) {}

  public render(fieldMetadata: FieldMetadata) {
    const rendered = this.child.render(fieldMetadata);

    const isChildLazy = this.child.shouldBeLazy(fieldMetadata);
    const maybeLazy = isChildLazy ? renderLazy(rendered) : rendered;

    return `yup.array(${maybeLazy})${fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
      this.isNonNull ? '.defined()' : '.nullable()'
    }${this.isDefined ? '.defined()' : ''}`;
  }

  public shouldBeLazy(): boolean {
    return false;
  }
}
