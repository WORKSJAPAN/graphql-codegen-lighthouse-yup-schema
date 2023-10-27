"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApi = void 0;
const graphql_1 = require("graphql");
const laravel_validation_rule_1 = require("./laravel_validation_rule");
/**
 * GraphQL schema
 * ```graphql
 * input ExampleInput {
 *   email: String! @rules(apply: ["minLength:100", "email"])
 * }
 */
const supportedDirectiveNames = ['rules', 'rulesForArray'];
const supportedArgumentName = 'apply';
function isSupportedDirective(directiveName) {
    return supportedDirectiveNames.includes(directiveName);
}
const buildApi = (rules, ignoreRules, directives) => {
    var _a;
    const ret = {
        rules: '',
        rulesForArray: '',
    };
    for (const directive of directives) {
        if (isSupportedDirective(directive.name.value)) {
            ret[directive.name.value] = buildApiFromDirectiveArguments(rules, ignoreRules, (_a = directive.arguments) !== null && _a !== void 0 ? _a : []);
        }
    }
    return ret;
};
exports.buildApi = buildApi;
const buildApiFromDirectiveArguments = (rules, ignoreRules, args) => {
    return args
        .filter(arg => arg.name.value === supportedArgumentName)
        .flatMap(({ value }) => {
        assertValueIsList(value, '`apply` argument must be a list of rules. For Example, ["integer", "max:255"].');
        return value.values.map(value => {
            assertValueIsString(value, 'rules must be a list of string. For Example, ["integer", "max:255"].');
            return buildApiSchema(rules, ignoreRules, value);
        });
    })
        .join('');
};
const buildApiSchema = (rules, ignoreRules, argValue) => {
    const method = (0, laravel_validation_rule_1.parse)(argValue.value);
    if (ignoreRules.includes(method.name)) {
        return '';
    }
    const mappedMethod = Object.assign(Object.assign({}, method), { name: mapMethodName(rules, method.name) });
    return (0, laravel_validation_rule_1.codify)(mappedMethod);
};
const mapMethodName = (rules, ruleName) => {
    const ruleMapping = rules[ruleName];
    if (!ruleMapping) {
        return ruleName;
    }
    if (Array.isArray(ruleMapping)) {
        return ruleMapping[0];
    }
    return ruleMapping;
};
function assertValueIsList(value, message) {
    if (value.kind !== graphql_1.Kind.LIST) {
        throw new Error(message);
    }
}
function assertValueIsString(value, message) {
    if (value.kind !== graphql_1.Kind.STRING) {
        throw new Error(message);
    }
}
