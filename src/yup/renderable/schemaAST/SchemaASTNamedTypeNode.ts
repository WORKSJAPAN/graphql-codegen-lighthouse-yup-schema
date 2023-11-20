import { Kind, NamedTypeNode } from 'graphql';

import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTRenderer } from './SchemaASTRenderer';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';

export class SchemaASTNamedTypeNode implements SchemaASTTypeNode {
  constructor(
    private readonly namedTypeNode: NamedTypeNode,
    private readonly name: string,
    private readonly convertedName: string | null,
    private readonly kind: Kind | null,
    private readonly isNonNull: boolean,
    private readonly isDefined: boolean
  ) {}

  public getData() {
    return {
      name: this.name,
      convertedName: this.convertedName,
      kind: this.kind,
      namedTypeNode: this.namedTypeNode,
      isNonNull: this.isNonNull,
      isDefined: this.isDefined,
    };
  }

  public render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderNamedType(this, fieldMetadata);
  }
}
