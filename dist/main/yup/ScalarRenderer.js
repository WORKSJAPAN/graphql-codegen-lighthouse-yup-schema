"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScalarRenderer = void 0;
class ScalarRenderer {
    constructor(scalarSchemas = {}, visitor) {
        this.scalarSchemas = scalarSchemas;
        this.visitor = visitor;
    }
    render(scalarName, scalarDirection) {
        if (this.scalarSchemas[scalarName]) {
            return `${this.scalarSchemas[scalarName]}`;
        }
        const tsType = this.visitor.getScalarType(scalarName, scalarDirection);
        switch (tsType) {
            case 'string':
                return `yup.string()`;
            case 'number':
                return `yup.number()`;
            case 'boolean':
                return `yup.boolean()`;
        }
        console.warn('unhandled name:', scalarName);
        return `yup.mixed()`;
    }
}
exports.ScalarRenderer = ScalarRenderer;
