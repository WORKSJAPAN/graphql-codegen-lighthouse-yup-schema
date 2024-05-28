export class ShapeRenderer {
    fieldRenderer;
    constructor(fieldRenderer) {
        this.fieldRenderer = fieldRenderer;
    }
    render(shape) {
        return shape
            .getData()
            .fields.map(field => field.render(this.fieldRenderer))
            .join(',\n');
    }
}
