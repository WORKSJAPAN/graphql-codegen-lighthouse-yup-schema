import { Kind } from 'graphql';

import { GetKindResult } from '../../../visitor';
import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNamedTypeNode } from './TypeASTNamedTypeNode';
import { TypeASTRenderer } from './TypeASTRenderer';

export class TypeASTNonScalarNamedTypeNode implements TypeASTNamedTypeNode {
  constructor(
    private readonly data: Readonly<{
      graphQLTypeName: string;
      tsTypeName: string | null;
      convertedName: string;
      kind: Exclude<GetKindResult, Kind.SCALAR_TYPE_DEFINITION | null>;
      isNonNull: boolean;
      isDefined: boolean;
      requiresLazy: boolean;
    }>
  ) {}

  public getData() {
    return {
      ...this.data,
    };
  }

  public render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderNonScalarNamedType(this, fieldMetadata);
  }

  public requiresLazy() {
    return this.data.requiresLazy;
  }
}
