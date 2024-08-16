import { TypeASTRenderer } from '../typeAST/TypeASTRenderer';
import { Field } from './Field';
export declare class FieldRenderer {
    private readonly typeASTRenderer;
    constructor(typeASTRenderer: TypeASTRenderer);
    renderField(field: Field): string;
}
