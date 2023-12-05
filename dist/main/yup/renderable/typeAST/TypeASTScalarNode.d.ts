import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNamedTypeNode } from './TypeASTNamedTypeNode';
import { TypeASTRenderer } from './TypeASTRenderer';
export declare class TypeASTScalarNode implements TypeASTNamedTypeNode {
    private readonly graphQLTypeName;
    private readonly tsTypeName;
    constructor(graphQLTypeName: string, tsTypeName: string | null);
    getData(): {
        graphQLTypeName: string;
        tsTypeName: string | null;
    };
    render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata): string;
    requiresLazy(): boolean;
}
