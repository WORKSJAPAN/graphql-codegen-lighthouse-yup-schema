import { Kind } from 'graphql';
import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTSingleNode } from './RuleASTSingleNode';
import { RuleASTSometimesNode } from './RuleASTSometimesNode';
export class RuleASTFactory {
    rules;
    ignoreRules;
    supportedArgumentName;
    constructor(rules = {}, ignoreRules = [], supportedArgumentName = 'apply') {
        this.rules = rules;
        this.ignoreRules = ignoreRules;
        this.supportedArgumentName = supportedArgumentName;
    }
    createFromDirectiveOrNull(fieldName, directive) {
        return directive ? this.createFromDirective(fieldName, directive) : this.createNullObject();
    }
    createNullObject() {
        return new RuleASTCompositeNode([]);
    }
    createFromDirective(fieldName, directive) {
        const ruleStrings = (directive.arguments ?? [])
            .filter(arg => arg.name.value === this.supportedArgumentName)
            .flatMap(({ value }) => {
            assertValueIsList(value, '`apply` argument must be a list of rules. For Example, ["integer", "max:255"].');
            return value.values.map(value => {
                assertValueIsString(value, 'rules must be a list of string. For Example, ["integer", "max:255"].');
                return value.value;
            });
        });
        return this.helper(fieldName, ruleStrings);
    }
    helper(fieldName, ruleStrings) {
        const parsed = ruleStrings.flatMap(ruleString => {
            const validationRule = parse(ruleString);
            if (this.ignoreRules.includes(validationRule.name)) {
                return [];
            }
            return {
                ...validationRule,
                name: this.mapMethodName(validationRule.name),
            };
        });
        const isSometimes = ({ name }) => name === 'sometimes';
        const isNotSometimes = ({ name }) => name !== 'sometimes';
        const sometimesIfExists = parsed.filter(isSometimes);
        const others = parsed.filter(isNotSometimes);
        const compositeRule = new RuleASTCompositeNode(others.map(({ name, rawArgs }) => new RuleASTSingleNode(name, rawArgs)));
        return sometimesIfExists.length === 0 ? compositeRule : new RuleASTSometimesNode(fieldName, compositeRule);
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
export const parse = (ruleString) => {
    const [name, rest] = ruleString.split(':');
    const rawArgs = rest ? rest.split(',') : [];
    return {
        name,
        rawArgs,
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
