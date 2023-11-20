import { SchemaASTNode } from '../schemaAST/SchemaASTNode';
import { FieldMetadata } from './FieldMetadata';
import { FieldRenderer } from './FieldRenderer';
export declare class Field {
    private readonly metadata;
    private readonly schema;
    constructor(metadata: FieldMetadata, schema: SchemaASTNode);
    getData(): {
        metadata: FieldMetadata;
        schema: SchemaASTNode;
    };
    render(fieldRenderer: FieldRenderer): string;
}
