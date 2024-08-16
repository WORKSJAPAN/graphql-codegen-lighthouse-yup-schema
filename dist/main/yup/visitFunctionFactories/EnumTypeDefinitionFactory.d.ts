import { EnumTypeDefinitionNode } from 'graphql';
import { Visitor } from '../../visitor';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';
export declare class EnumTypeDefinitionFactory implements VisitFunctionFactory<EnumTypeDefinitionNode> {
    private readonly enumsAsType;
    private readonly registry;
    private readonly visitor;
    constructor(enumsAsType: boolean, registry: Registry, visitor: Visitor);
    create(): (node: EnumTypeDefinitionNode) => void;
    private render;
    private renderAsType;
    private renderAsConst;
}
