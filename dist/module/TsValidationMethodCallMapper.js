import { parse } from './LaravelValidationRule';
import { TsValidationMethodCall } from './TsValidationMethodCall';
export class TsValidationMethodCallMapper {
    rules;
    ignoreRules;
    constructor(rules, ignoreRules) {
        this.rules = rules;
        this.ignoreRules = ignoreRules;
    }
    create(ruleString) {
        const validationRule = parse(ruleString);
        if (this.ignoreRules.includes(validationRule.name)) {
            return null;
        }
        return new TsValidationMethodCall(this.mapMethodName(validationRule.name), validationRule.rawArgs.map(codifyArgument));
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
