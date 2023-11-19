"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeRenderer = void 0;
class ShapeRenderer {
    constructor(fieldRenderer) {
        this.fieldRenderer = fieldRenderer;
    }
    render(fields) {
        return fields === null || fields === void 0 ? void 0 : fields.map(field => {
            return this.fieldRenderer.render(field, 2);
        }).join(',\n');
    }
}
exports.ShapeRenderer = ShapeRenderer;
