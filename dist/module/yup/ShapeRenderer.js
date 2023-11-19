export class ShapeRenderer {
    fieldRenderer;
    constructor(fieldRenderer) {
        this.fieldRenderer = fieldRenderer;
    }
    render(fields) {
        return fields
            ?.map(field => {
            return this.fieldRenderer.render(field, 2);
        })
            .join(',\n');
    }
}
