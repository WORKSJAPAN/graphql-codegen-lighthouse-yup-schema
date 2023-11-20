import { Kind } from 'graphql';
import { GetKindResult } from '../../../visitor';
import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';
import { SchemaASTRenderer } from './SchemaASTRenderer';
export declare class SchemaASTNonScalarNamedTypeNode implements SchemaASTNamedTypeNode {
    private readonly data;
    constructor(data: Readonly<{
        graphQLTypeName: string;
        tsTypeName: string | null;
        convertedName: string;
        kind: Exclude<GetKindResult, Kind.SCALAR_TYPE_DEFINITION | null>;
        isNonNull: boolean;
        isDefined: boolean;
    }>);
    getData(): {
        graphQLTypeName: string;
        tsTypeName: string | null;
        convertedName: string;
        kind: Kind.OBJECT_TYPE_DEFINITION | Kind.UNION_TYPE_DEFINITION | Kind.ENUM_TYPE_DEFINITION | Kind.INPUT_OBJECT_TYPE_DEFINITION;
        isNonNull: boolean;
        isDefined: boolean;
    };
    render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata): string;
}
