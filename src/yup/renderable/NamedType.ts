import { NamedTypeNode } from 'graphql';

import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class NamedType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly fieldMetadata: FieldMetadata,
    readonly namedTypeNode: NamedTypeNode,
    readonly isNonNull: boolean
  ) {}

  public render() {
    const isLazy = this.fieldRenderer.isLazy(this.namedTypeNode);
    const gen =
      this.fieldRenderer.generateNameNodeYupSchema(this.namedTypeNode.name) +
      this.fieldMetadata.getGeneratedCodesForDirectives().rules;
    if (this.isNonNull) {
      const rendered = this.fieldRenderer.shouldEmitAsNotAllowEmptyString(this.namedTypeNode.name.value)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;

      return {
        isLazy,
        rendered,
      };
    }
    const typ = this.fieldRenderer.getVisitor().getType(this.namedTypeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      return {
        isLazy,
        rendered: `${gen}`,
      };
    }
    return {
      isLazy,
      rendered: `${gen}.nullable()`,
    };
  }
}
