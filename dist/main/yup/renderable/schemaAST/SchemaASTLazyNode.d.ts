import { FieldMetadata } from '../field/FieldMetadata';
import { SchemaASTNode } from './SchemaASTNode';
import { SchemaASTRenderer } from './SchemaASTRenderer';
import { SchemaASTTypeNode } from './SchemaASTTypeNode';
export declare class SchemaASTLazyNode implements SchemaASTNode {
    private readonly child;
    constructor(child: SchemaASTTypeNode);
    getData(): {
        child: SchemaASTTypeNode;
    };
    render(schemaASTRenderer: SchemaASTRenderer, fieldMetadata: FieldMetadata): string;
}
