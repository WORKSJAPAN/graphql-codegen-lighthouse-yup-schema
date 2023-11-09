import { Kind, } from 'graphql';
import { TsValidationMethodCallMapper } from './TsValidationMethodCallMapper';
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
export const buildApi = (rules, ignoreRules, directives) => {
    const ret = {
        rules: '',
        rulesForArray: '',
    };
    for (const directive of directives) {
        if (isSupportedDirective(directive.name.value)) {
            ret[directive.name.value] = buildApiFromDirectiveArguments(rules, ignoreRules, directive.arguments ?? []);
        }
    }
    return ret;
};
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
    const mapper = new TsValidationMethodCallMapper(rules, ignoreRules);
    const TsValidationRuleMethodCall = mapper.create(argValue.value);
    return TsValidationRuleMethodCall?.toString() ?? '';
};
function assertValueIsList(value, message) {
    if (value.kind !== Kind.LIST) {
        throw new Error(message);
    }
}
function assertValueIsString(value, message) {
    if (value.kind !== Kind.STRING) {
        throw new Error(message);
    }
}
