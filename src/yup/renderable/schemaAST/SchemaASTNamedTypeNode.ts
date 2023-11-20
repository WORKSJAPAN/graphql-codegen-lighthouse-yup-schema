import { NamedTypeNode } from 'graphql';

import { FieldRenderer } from '../../FieldRenderer';
import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';

export class SchemaASTNamedTypeNode implements SchemaASTTypeNode {
  constructor(
    readonly namedTypeNode: NamedTypeNode,
    readonly isNonNull: boolean,
    readonly isDefined: boolean
  ) {}

  public getData() {
    return {
      namedTypeNode: this.namedTypeNode,
      isNonNull: this.isNonNull,
      isDefined: this.isDefined,
    };
  }

  public render(fieldRenderer: FieldRenderer, fieldMetadata: FieldMetadata) {
    return fieldRenderer.renderNamedType(this, fieldMetadata);
  }
}
