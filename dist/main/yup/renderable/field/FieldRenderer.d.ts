import { SchemaASTRenderer } from '../schemaAST/SchemaASTRenderer';
import { Field } from './Field';
export declare class FieldRenderer {
    private readonly schemaASTRenderer;
    constructor(schemaASTRenderer: SchemaASTRenderer);
    renderField(field: Field): string;
}
