import { TypeNode } from 'graphql';

import { Renderable } from './Renderable';

export class NullRenderable implements Renderable {
  constructor(private readonly typeNode: TypeNode) {}

  render() {
    console.warn('unhandled type:', this.typeNode);
    return {
      isLazy: false,
      rendered: '',
    };
  }
}
