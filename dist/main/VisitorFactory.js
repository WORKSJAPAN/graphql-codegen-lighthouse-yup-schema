"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisitorFactory = void 0;
const visitor_1 = require("./visitor");
class VisitorFactory {
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
    }
    createVisitor(scalarDirection) {
        return new visitor_1.Visitor(scalarDirection, this.schema, this.config);
    }
}
exports.VisitorFactory = VisitorFactory;
