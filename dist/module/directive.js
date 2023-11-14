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
export const buildApi = (fieldName, rules, ignoreRules, directives) => {
    const ret = {
        rules: '',
        rulesForArray: '',
    };
    for (const directive of directives) {
        if (isSupportedDirective(directive.name.value)) {
            ret[directive.name.value] = buildApiFromDirectiveArguments(fieldName, rules, ignoreRules, directive.arguments ?? []);
        }
    }
    return ret;
};
const buildApiFromDirectiveArguments = (fieldName, rules, ignoreRules, args) => {
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
        return `.sometimes(${JSON.stringify(fieldName)}, schema => schema${methodChain})`;
    }
    return methodChain;
};
/**
 * sometimes は超特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
 */
const buildApiSchema = (rules, ignoreRules, argValue) => {
    if (argValue.value === 'sometimes') {
        return {
            sometimes: true,
        };
    }
    const mapper = new TsValidationMethodCallMapper(rules, ignoreRules);
    const tsValidationRuleMethodCall = mapper.create(argValue.value);
    return {
        sometimes: false,
        value: tsValidationRuleMethodCall?.toString() ?? '',
    };
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
