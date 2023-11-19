import { NamedTypeNode } from 'graphql';

import { FieldRenderer } from '../FieldRenderer';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class NamedType implements Renderable {
  constructor(
    readonly fieldRenderer: FieldRenderer,
    readonly namedTypeNode: NamedTypeNode,
    readonly isNonNull: boolean
  ) {}

  public render(fieldMetadata: FieldMetadata) {
    const gen =
      this.fieldRenderer.generateNameNodeYupSchema(this.namedTypeNode.name) +
      fieldMetadata.getGeneratedCodesForDirectives().rules;
    if (this.isNonNull) {
      return this.fieldRenderer.shouldEmitAsNotAllowEmptyString(this.namedTypeNode.name.value)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;
    }
    const typ = this.fieldRenderer.getVisitor().getType(this.namedTypeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      return `${gen}`;
    }
    return `${gen}.nullable()`;
  }

  public shouldBeLazy(): boolean {
    return this.fieldRenderer.isLazy(this.namedTypeNode);
  }
}
