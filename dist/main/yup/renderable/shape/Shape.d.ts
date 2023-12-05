import { Field } from '../field/Field';
import { ShapeRenderer } from './ShapeRenderer';
export declare class Shape {
    private readonly fields;
    constructor(fields: readonly Field[]);
    getData(): {
        fields: readonly Field[];
    };
    render(shapeRenderer: ShapeRenderer): string;
}
