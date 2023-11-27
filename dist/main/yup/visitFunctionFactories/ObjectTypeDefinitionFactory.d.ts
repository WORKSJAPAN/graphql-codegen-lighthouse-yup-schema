import { ObjectTypeDefinitionNode } from 'graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { Registry } from '../registry';
import { ShapeFactory } from '../renderable/shape/ShapeFactory';
import { ShapeRenderer } from '../renderable/shape/ShapeRenderer';
import { WithObjectTypesSpec } from '../withObjectTypesSpecs/WithObjectTypesSpec';
import { VisitFunctionFactory } from './types';
export declare class ObjectTypeDefinitionFactory implements VisitFunctionFactory<ObjectTypeDefinitionNode> {
    private readonly registry;
    private readonly visitor;
    private readonly withObjectTypesSpec;
    private readonly exportTypeStrategy;
    private readonly shapeFactory;
    private readonly shapeRenderer;
    private readonly addUnderscoreToArgsType;
    constructor(registry: Registry, visitor: Visitor, withObjectTypesSpec: WithObjectTypesSpec, exportTypeStrategy: ExportTypeStrategy, shapeFactory: ShapeFactory, shapeRenderer: ShapeRenderer, addUnderscoreToArgsType?: boolean);
    create(): (node: ObjectTypeDefinitionNode) => string | undefined;
    private buildArgumentsSchemaBlock;
}
