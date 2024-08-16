"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShapeFactory = void 0;
const Shape_1 = require("./Shape");
class ShapeFactory {
    constructor(fieldFactory) {
        this.fieldFactory = fieldFactory;
    }
    create(graphQLFields) {
        return new Shape_1.Shape(graphQLFields.map(field => this.fieldFactory.create(field)));
    }
}
exports.ShapeFactory = ShapeFactory;
