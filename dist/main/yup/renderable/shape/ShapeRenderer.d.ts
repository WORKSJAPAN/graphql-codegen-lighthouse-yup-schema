import { FieldRenderer } from '../field/FieldRenderer';
import { Shape } from './Shape';
export declare class ShapeRenderer {
    private readonly fieldRenderer;
    constructor(fieldRenderer: FieldRenderer);
    render(shape: Shape): string;
}
