"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsValidationMethodCallMapper = void 0;
const LaravelValidationRule_1 = require("./LaravelValidationRule");
const TsValidationMethodCall_1 = require("./TsValidationMethodCall");
class TsValidationMethodCallMapper {
    constructor(rules, ignoreRules) {
        this.rules = rules;
        this.ignoreRules = ignoreRules;
    }
    create(ruleString) {
        const validationRule = (0, LaravelValidationRule_1.parse)(ruleString);
        if (this.ignoreRules.includes(validationRule.name)) {
            return null;
        }
        return new TsValidationMethodCall_1.TsValidationMethodCall(this.mapMethodName(validationRule.name), validationRule.rawArgs.map(codifyArgument));
    }
    mapMethodName(ruleName) {
        const ruleMapping = this.rules[ruleName];
        if (!ruleMapping) {
            return ruleName;
        }
        if (Array.isArray(ruleMapping)) {
            return ruleMapping[0];
        }
        return ruleMapping;
    }
}
exports.TsValidationMethodCallMapper = TsValidationMethodCallMapper;
const isNumber = (rawArg) => parseFloat(rawArg).toString() === rawArg;
const isBoolean = (rawArg) => rawArg.toLowerCase() === 'true' || rawArg.toLowerCase() === 'false';
const isRegex = (rawArg) => rawArg.startsWith('/');
const codifyArgument = (rawArg) => {
    if (isNumber(rawArg) || isBoolean(rawArg) || isRegex(rawArg)) {
        return rawArg;
    }
    // here, rawArg seems to be string
    return JSON.stringify(rawArg);
};
