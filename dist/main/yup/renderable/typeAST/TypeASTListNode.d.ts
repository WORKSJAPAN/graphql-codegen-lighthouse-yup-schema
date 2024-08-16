import { FieldMetadata } from '../field/FieldMetadata';
import { TypeASTNode } from './TypeASTNode';
import { TypeASTRenderer } from './TypeASTRenderer';
export declare class TypeASTListNode implements TypeASTNode {
    private readonly child;
    constructor(child: TypeASTNode);
    getData(): {
        child: TypeASTNode;
    };
    render(schemaASTRenderer: TypeASTRenderer, fieldMetadata: FieldMetadata): string;
    requiresLazy(): boolean;
}
