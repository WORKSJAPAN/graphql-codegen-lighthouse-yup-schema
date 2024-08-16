export class Field {
    metadata;
    type;
    constructor(metadata, type) {
        this.metadata = metadata;
        this.type = type;
    }
    getData() {
        return {
            metadata: this.metadata,
            type: this.type,
        };
    }
    requiresLazy() {
        return this.metadata.requiresLazy() || this.type.requiresLazy();
    }
    render(fieldRenderer) {
        return fieldRenderer.renderField(this);
    }
}
