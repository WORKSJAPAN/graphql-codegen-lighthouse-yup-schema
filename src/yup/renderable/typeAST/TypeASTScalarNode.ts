import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNamedTypeNode } from './TypeASTNamedTypeNode';
import { TypeASTRenderer } from './TypeASTRenderer';

export class TypeASTScalarNode implements TypeASTNamedTypeNode {
  constructor(
    private readonly graphQLTypeName: string,
    private readonly tsTypeName: string | null,
    private readonly isNonNull: boolean,
    private readonly isDefined: boolean
  ) {}

  public getData() {
    return {
      graphQLTypeName: this.graphQLTypeName,
      tsTypeName: this.tsTypeName,
      isNonNull: this.isNonNull,
      isDefined: this.isDefined,
    };
  }

  public render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata) {
    return schemaASTRenderer.renderScalar(this, fieldMetadata);
  }

  public requiresLazy() {
    return false;
  }
}
