"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeRenderer = void 0;
class ShapeRenderer {
    constructor(fieldRenderer, fieldFactory) {
        this.fieldRenderer = fieldRenderer;
        this.fieldFactory = fieldFactory;
    }
    render(fields) {
        return fields === null || fields === void 0 ? void 0 : fields.map(field => {
            const astField = this.fieldFactory.create(field);
            return astField.render(this.fieldRenderer);
        }).join(',\n');
    }
}
exports.ShapeRenderer = ShapeRenderer;
