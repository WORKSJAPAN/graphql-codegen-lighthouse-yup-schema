import { TypeASTNode } from '../typeAST/TypeASTNode';
import { FieldMetadata } from './FieldMetadata';
import { FieldRenderer } from './FieldRenderer';
export declare class Field {
    private readonly metadata;
    private readonly type;
    constructor(metadata: FieldMetadata, type: TypeASTNode);
    getData(): {
        metadata: FieldMetadata;
        type: TypeASTNode;
    };
    requiresLazy(): boolean;
    render(fieldRenderer: FieldRenderer): string;
}
