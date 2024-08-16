import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { FieldFactory } from '../field/FieldFactory';
import { Shape } from './Shape';
export declare class ShapeFactory {
    private readonly fieldFactory;
    constructor(fieldFactory: FieldFactory);
    create(graphQLFields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]): Shape;
}
