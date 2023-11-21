"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMetadata = void 0;
class FieldMetadata {
    constructor(data) {
        this.data = data;
    }
    getData() {
        return Object.assign({}, this.data);
    }
    requiresLazy() {
        return this.data.rule.requiresLazy() || this.data.ruleForArray.requiresLazy();
    }
}
exports.FieldMetadata = FieldMetadata;
