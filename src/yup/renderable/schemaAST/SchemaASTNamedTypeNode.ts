import { Kind } from 'graphql';

import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTRenderer } from './SchemaASTRenderer';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';

export class SchemaASTNamedTypeNode implements SchemaASTTypeNode {
  constructor(
    private readonly data: Readonly<{
      graphQLTypeName: string;
      tsTypeName: string | null;
      convertedName: string;
      kind: Kind | null;
      isNonNull: boolean;
      isDefined: boolean;
    }>
  ) {}

  public getData() {
    return {
      ...this.data,
    };
  }

  public render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderNamedType(this, fieldMetadata);
  }
}
