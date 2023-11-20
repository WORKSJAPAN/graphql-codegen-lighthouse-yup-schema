import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { TypeNode } from 'graphql';
import { Visitor } from '../../../visitor';
import { SchemaASTNode } from './SchemaASTNode';
export declare class SchemaASTFactory {
    private readonly lazyTypes;
    private readonly scalarDirection;
    private readonly visitor;
    constructor(lazyTypes: readonly string[], scalarDirection: keyof NormalizedScalarsMap[string], visitor: Visitor);
    create(graphQLTypeNode: TypeNode, isDefined?: boolean): SchemaASTNode;
    private helper;
    private createFromNamedTypeNode;
    private isLazy;
}
