import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';
import { renderLazy } from './utils';

export class ListType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly fieldMetadata: FieldMetadata,
    readonly child: Renderable,
    readonly isNonNull: boolean
  ) {}

  public render() {
    const rendered = this.child.render();

    const isChildLazy = this.child.shouldBeLazy();

    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    const arrayContent = `${rendered}.defined()`;
    const maybeLazy = isChildLazy ? renderLazy(arrayContent) : arrayContent;

    return `yup.array(${maybeLazy})${this.fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
      this.isNonNull ? '.defined()' : '.nullable()'
    }`;
  }

  public shouldBeLazy(): boolean {
    return false;
  }
}
