"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildApi = void 0;
const graphql_1 = require("graphql");
const TsValidationMethodCallMapper_1 = require("./TsValidationMethodCallMapper");
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
    let sometimesIncluded = false;
    const methodChain = args
        .filter(arg => arg.name.value === supportedArgumentName)
        .flatMap(({ value }) => {
        assertValueIsList(value, '`apply` argument must be a list of rules. For Example, ["integer", "max:255"].');
        return value.values.map(value => {
            assertValueIsString(value, 'rules must be a list of string. For Example, ["integer", "max:255"].');
            const built = buildApiSchema(rules, ignoreRules, value);
            if (built.sometimes) {
                sometimesIncluded = true;
                return '';
            }
            return built.value;
        });
    })
        .join('');
    if (sometimesIncluded) {
        return `.sometimes(schema => schema${methodChain})`;
    }
    return methodChain;
};
const buildApiSchema = (rules, ignoreRules, argValue) => {
    var _a;
    if (argValue.value === 'sometimes') {
        return {
            sometimes: true,
        };
    }
    const mapper = new TsValidationMethodCallMapper_1.TsValidationMethodCallMapper(rules, ignoreRules);
    const tsValidationRuleMethodCall = mapper.create(argValue.value);
    return {
        sometimes: false,
        value: (_a = tsValidationRuleMethodCall === null || tsValidationRuleMethodCall === void 0 ? void 0 : tsValidationRuleMethodCall.toString()) !== null && _a !== void 0 ? _a : '',
    };
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
