import { TypeNode } from 'graphql';
import { SchemaASTNode } from './SchemaASTNode';
export declare class SchemaASTNullNode implements SchemaASTNode {
    private readonly typeNode;
    constructor(typeNode: TypeNode);
    render(): string;
}
