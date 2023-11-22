import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { FieldFactory } from './renderable/field/FieldFactory';
import { FieldRenderer } from './renderable/field/FieldRenderer';
export declare class ShapeRenderer {
    private readonly fieldRenderer;
    private readonly fieldFactory;
    constructor(fieldRenderer: FieldRenderer, fieldFactory: FieldFactory);
    render(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]): string;
}
