import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { FieldRenderer } from './FieldRenderer';
export declare class ShapeRenderer {
    private readonly fieldRenderer;
    constructor(fieldRenderer: FieldRenderer);
    render(fields: readonly (InputValueDefinitionNode | FieldDefinitionNode)[]): string;
}
