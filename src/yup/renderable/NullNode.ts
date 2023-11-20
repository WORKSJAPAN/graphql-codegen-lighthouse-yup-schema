import { TypeNode } from 'graphql';

import { AstTypeNode } from './AstTypeNode';
import { Renderable } from './Renderable';

export class NullNode implements Renderable, AstTypeNode {
  constructor(private readonly typeNode: TypeNode) {}

  render() {
    console.warn('unhandled type:', this.typeNode);
    return '';
  }

  shouldBeLazy() {
    return false;
  }
}
