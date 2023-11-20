import { NamedTypeNode } from 'graphql';

import { FieldRenderer } from '../FieldRenderer';
import { AstTypeNode } from './AstTypeNode';
import { FieldMetadata } from './FieldMetadata';
import { Renderable } from './Renderable';

export class NamedType implements Renderable, AstTypeNode {
  constructor(
    readonly namedTypeNode: NamedTypeNode,
    readonly isNonNull: boolean,
    readonly isDefined: boolean
  ) {}

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    const gen =
      fieldRenderer.generateNameNodeYupSchema(this.namedTypeNode.name) +
      fieldMetadata.getGeneratedCodesForDirectives().rules;
    if (this.isNonNull) {
      const ret = fieldRenderer.shouldEmitAsNotAllowEmptyString(this.namedTypeNode.name.value)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;
      return this.isDefined ? `${ret}.defined()` : `${ret}`;
    }

    // オブジェクトを入力する場合はnullable()をつけない (undefined なことはある)
    const typ = fieldRenderer.getVisitor().getType(this.namedTypeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      const ret = `${gen}`;
      return this.isDefined ? `${ret}.defined()` : `${ret}`;
    }
    const ret = `${gen}.nullable()`;
    return this.isDefined ? `${ret}.defined()` : `${ret}`;
  }
}
