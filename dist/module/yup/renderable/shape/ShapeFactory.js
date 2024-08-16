import { Shape } from './Shape';
export class ShapeFactory {
    fieldFactory;
    constructor(fieldFactory) {
        this.fieldFactory = fieldFactory;
    }
    create(graphQLFields) {
        return new Shape(graphQLFields.map(field => this.fieldFactory.create(field)));
    }
}
