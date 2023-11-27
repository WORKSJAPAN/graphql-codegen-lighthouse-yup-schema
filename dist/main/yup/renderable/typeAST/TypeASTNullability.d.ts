import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTRenderer } from './TypeASTRenderer';
export declare class TypeASTNullability implements TypeASTNode {
    private readonly child;
    private readonly isNonNull;
    constructor(child: Exclude<TypeASTNode, TypeASTNullability>, isNonNull: boolean);
    getData(): {
        child: TypeASTNode;
        isNonNull: boolean;
    };
    render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata): string;
    requiresLazy(): boolean;
}
