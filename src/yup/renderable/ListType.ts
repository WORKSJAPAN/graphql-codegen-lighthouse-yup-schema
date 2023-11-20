import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';
import { renderLazy } from './utils';

export class ListType implements Renderable, AstTypeNode {
  constructor(
    private readonly child: Renderable,
    private readonly isNonNull: boolean
  ) {}

  public render(fieldMetadata: FieldMetadata) {
    const rendered = this.child.render(fieldMetadata);
    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    const arrayContent = `${rendered}.defined()`;

    const isChildLazy = this.child.shouldBeLazy(fieldMetadata);
    const maybeLazy = isChildLazy ? renderLazy(arrayContent) : arrayContent;

    return `yup.array(${maybeLazy})${fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
      this.isNonNull ? '.defined()' : '.nullable()'
    }`;
  }

  public shouldBeLazy(): boolean {
    return false;
  }
}
