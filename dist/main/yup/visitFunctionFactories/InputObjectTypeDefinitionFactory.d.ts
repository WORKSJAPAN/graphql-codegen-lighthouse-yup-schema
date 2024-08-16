import { InputObjectTypeDefinitionNode } from 'graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { Registry } from '../registry';
import { ShapeFactory } from '../renderable/shape/ShapeFactory';
import { ShapeRenderer } from '../renderable/shape/ShapeRenderer';
import { VisitFunctionFactory } from './types';
export declare class InputObjectTypeDefinitionFactory implements VisitFunctionFactory<InputObjectTypeDefinitionNode> {
    private readonly registry;
    private readonly visitor;
    private readonly exportTypeStrategy;
    private readonly shapeFactory;
    private readonly shapeRenderer;
    constructor(registry: Registry, visitor: Visitor, exportTypeStrategy: ExportTypeStrategy, shapeFactory: ShapeFactory, shapeRenderer: ShapeRenderer);
    create(): (node: InputObjectTypeDefinitionNode) => string;
}
