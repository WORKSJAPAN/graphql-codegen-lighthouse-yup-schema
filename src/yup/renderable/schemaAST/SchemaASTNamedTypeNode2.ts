import { GetKindResult } from '../../../visitor';
import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';
import { SchemaASTRenderer } from './SchemaASTRenderer';

export class SchemaASTNamedTypeNode2 implements SchemaASTNamedTypeNode {
  constructor(
    private readonly data: Readonly<{
      graphQLTypeName: string;
      tsTypeName: string | null;
      convertedName: string;
      kind: GetKindResult;
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
    return schemaASTRenderer.renderNamedType2(this, fieldMetadata);
  }
}
