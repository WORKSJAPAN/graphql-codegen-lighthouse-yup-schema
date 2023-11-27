"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
class Field {
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
exports.Field = Field;
