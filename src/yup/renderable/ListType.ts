import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class ListType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly fieldMetadata: FieldMetadata,
    readonly child: Renderable,
    readonly isNonNull: boolean
  ) {}

  public render() {
    const { isLazy, rendered } = this.child.render();

    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    const arrayContent = `${rendered}.defined()`;
    const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(arrayContent) : arrayContent;

    return {
      isLazy: false,
      rendered: `yup.array(${maybeLazy})${this.fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
        this.isNonNull ? '.defined()' : '.nullable()'
      }`,
    };
  }
}
