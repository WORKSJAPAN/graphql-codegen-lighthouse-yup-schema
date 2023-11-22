import { UnionTypeDefinitionNode } from 'graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { Registry } from '../registry';
import { WithObjectTypesSpec } from '../withObjectTypesSpecs/WithObjectTypesSpec';
import { VisitFunctionFactory } from './types';
export declare class UnionTypesDefinitionFactory implements VisitFunctionFactory<UnionTypeDefinitionNode> {
    private readonly registry;
    private readonly visitor;
    private readonly withObjectTypesSpec;
    private readonly exportTypeStrategy;
    constructor(registry: Registry, visitor: Visitor, withObjectTypesSpec: WithObjectTypesSpec, exportTypeStrategy: ExportTypeStrategy);
    create(): ((node: UnionTypeDefinitionNode) => string | undefined) | undefined;
}
