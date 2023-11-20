import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';
import { SchemaASTRenderer } from './SchemaASTRenderer';
export declare class SchemaASTScalarNode implements SchemaASTNamedTypeNode {
    private readonly graphQLTypeName;
    private readonly tsTypeName;
    private readonly isNonNull;
    private readonly isDefined;
    constructor(graphQLTypeName: string, tsTypeName: string | null, isNonNull: boolean, isDefined: boolean);
    getData(): {
        graphQLTypeName: string;
        tsTypeName: string | null;
        isNonNull: boolean;
        isDefined: boolean;
    };
    render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata): string;
}
