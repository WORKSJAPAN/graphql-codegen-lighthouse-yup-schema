import { Kind } from 'graphql';
import { GetKindResult } from '../../../visitor';
import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTRenderer } from './TypeASTRenderer';
export declare class TypeASTNonScalarNamedTypeNode implements TypeASTNode {
    private readonly data;
    constructor(data: Readonly<{
        graphQLTypeName: string;
        tsTypeName: string | null;
        convertedName: string;
        kind: Exclude<GetKindResult, Kind.SCALAR_TYPE_DEFINITION | null>;
        requiresLazy: boolean;
    }>);
    getData(): {
        graphQLTypeName: string;
        tsTypeName: string | null;
        convertedName: string;
        kind: Kind.OBJECT_TYPE_DEFINITION | Kind.UNION_TYPE_DEFINITION | Kind.ENUM_TYPE_DEFINITION | Kind.INPUT_OBJECT_TYPE_DEFINITION;
        requiresLazy: boolean;
    };
    render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata): string;
    requiresLazy(): boolean;
}
