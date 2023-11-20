import { TypeNode } from 'graphql';

import { ASTNode } from './ASTNode';

export class ASTNullNode implements ASTNode {
  constructor(private readonly typeNode: TypeNode) {}

  render() {
    console.warn('unhandled type:', this.typeNode);
    return '';
  }
}
