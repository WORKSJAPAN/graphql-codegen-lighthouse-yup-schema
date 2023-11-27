"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Shape = void 0;
class Shape {
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
exports.Shape = Shape;
