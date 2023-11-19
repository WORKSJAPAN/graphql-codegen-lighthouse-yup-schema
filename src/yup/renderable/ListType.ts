import { ListTypeNode } from 'graphql';

import { GeneratedCodesForDirectives } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';
import { Renderable } from './Renderable';

export class ListType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly generatedCodesForDirectives: GeneratedCodesForDirectives,
    readonly listTypeNode: ListTypeNode,
    readonly isNonNull: boolean
  ) {}

  public render() {
    const innerTypeNode = this.listTypeNode.type;
    const { isLazy, rendered } = this.fieldRenderer.handleAllType(innerTypeNode, this.generatedCodesForDirectives);

    // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
    const arrayContent = `${rendered}.defined()`;
    const maybeLazy = isLazy ? this.fieldRenderer.renderLazy(arrayContent) : arrayContent;

    return {
      isLazy: false,
      rendered: `yup.array(${maybeLazy})${this.generatedCodesForDirectives.rulesForArray}${
        this.isNonNull ? '.defined()' : '.nullable()'
      }`,
    };
  }
}
