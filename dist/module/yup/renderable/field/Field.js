export class Field {
    metadata;
    schema;
    constructor(metadata, schema) {
        this.metadata = metadata;
        this.schema = schema;
    }
    getData() {
        return {
            metadata: this.metadata,
            schema: this.schema,
        };
    }
    render(fieldRenderer) {
        return fieldRenderer.renderField(this);
    }
}
