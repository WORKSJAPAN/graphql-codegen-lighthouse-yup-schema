"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeRenderer = void 0;
class ShapeRenderer {
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
exports.ShapeRenderer = ShapeRenderer;
