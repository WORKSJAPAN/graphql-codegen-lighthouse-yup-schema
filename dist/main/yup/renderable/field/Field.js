"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
class Field {
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
exports.Field = Field;
