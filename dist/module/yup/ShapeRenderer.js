export class ShapeRenderer {
    fieldRenderer;
    fieldFactory;
    constructor(fieldRenderer, fieldFactory) {
        this.fieldRenderer = fieldRenderer;
        this.fieldFactory = fieldFactory;
    }
    render(fields) {
        return fields
            ?.map(field => {
            const astField = this.fieldFactory.create(field);
            return astField.render(this.fieldRenderer);
        })
            .join(',\n');
    }
}
