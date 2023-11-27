export class Shape {
    fields;
    constructor(fields) {
        this.fields = fields;
    }
    getData() {
        return {
            fields: this.fields,
        };
    }
    render(shapeRenderer) {
        return shapeRenderer.render(this);
    }
}
