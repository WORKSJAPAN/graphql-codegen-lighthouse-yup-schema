"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldMetadata = void 0;
class FieldMetadata {
    constructor(name, isOptional, rule, ruleForArray) {
        this.name = name;
        this.isOptional = isOptional;
        this.rule = rule;
        this.ruleForArray = ruleForArray;
    }
    getData() {
        return {
            name: this.name,
            isOptional: this.isOptional,
            rule: this.rule,
            ruleForArray: this.ruleForArray,
        };
    }
}
exports.FieldMetadata = FieldMetadata;
