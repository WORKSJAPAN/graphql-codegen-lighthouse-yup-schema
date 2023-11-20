import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTRenderer } from './SchemaASTRenderer';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';
export declare class SchemaASTListNode implements SchemaASTTypeNode {
    private readonly child;
    private readonly isNonNull;
    private readonly isDefined;
    constructor(child: SchemaASTTypeNode | SchemaASTLazyNode, isNonNull: boolean, isDefined: boolean);
    getData(): {
        child: SchemaASTTypeNode | SchemaASTLazyNode;
        isNonNull: boolean;
        isDefined: boolean;
    };
    render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata): string;
}
