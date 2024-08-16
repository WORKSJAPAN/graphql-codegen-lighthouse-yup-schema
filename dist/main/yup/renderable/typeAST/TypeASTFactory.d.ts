import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { TypeNode } from 'graphql';
import { Visitor } from '../../../visitor';
import { TypeASTNode } from './TypeASTNode';
export declare class TypeASTFactory {
    private readonly lazyTypes;
    private readonly scalarDirection;
    private readonly visitor;
    constructor(lazyTypes: readonly string[], scalarDirection: keyof NormalizedScalarsMap[string], visitor: Visitor);
    create(graphQLTypeNode: TypeNode): TypeASTNode;
    private createForListOrNamedType;
    private createFromNamedTypeNode;
    private requiresLazy;
}
