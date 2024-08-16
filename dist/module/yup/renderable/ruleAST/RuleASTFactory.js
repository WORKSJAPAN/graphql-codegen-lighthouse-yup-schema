import { Kind } from 'graphql';
import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTSingleNode } from './RuleASTSingleNode';
import { RuleASTSometimesNode } from './RuleASTSometimesNode';
export class RuleASTFactory {
    rules;
    ignoreRules;
    lazyRules;
    supportedArgumentName;
    constructor(rules = {}, ignoreRules = [], lazyRules = [], supportedArgumentName = 'apply') {
        this.rules = rules;
        this.ignoreRules = ignoreRules;
        this.lazyRules = lazyRules;
        this.supportedArgumentName = supportedArgumentName;
    }
    createFromDirectiveOrNull(directive) {
        return directive ? this.createFromDirective(directive) : this.createNullObject();
    }
    createNullObject() {
        return new RuleASTCompositeNode([]);
    }
    createFromDirective(directive) {
        const ruleStrings = (directive.arguments ?? [])
            .filter(arg => arg.name.value === this.supportedArgumentName)
            .flatMap(({ value }) => {
            assertValueIsList(value, '`apply` argument must be a list of rules. For Example, ["integer", "max:255"].');
            return value.values.map(value => {
                assertValueIsString(value, 'rules must be a list of string. For Example, ["integer", "max:255"].');
                return value.value;
            });
        });
        return this.helper(ruleStrings);
    }
    helper(ruleStrings) {
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
        const compositeRule = new RuleASTCompositeNode(others.map(({ name, rawArgs }) => new RuleASTSingleNode(name, rawArgs, this.requiresLazy(name))));
        return sometimesIfExists.length === 0
            ? compositeRule
            : new RuleASTSometimesNode(compositeRule, this.requiresLazy('sometimes'));
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
    requiresLazy(ruleName) {
        return this.lazyRules.includes(ruleName);
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
