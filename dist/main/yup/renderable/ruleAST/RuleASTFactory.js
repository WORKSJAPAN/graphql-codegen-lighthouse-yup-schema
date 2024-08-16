"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.RuleASTFactory = void 0;
const graphql_1 = require("graphql");
const RuleASTCompositeNode_1 = require("./RuleASTCompositeNode");
const RuleASTSingleNode_1 = require("./RuleASTSingleNode");
const RuleASTSometimesNode_1 = require("./RuleASTSometimesNode");
class RuleASTFactory {
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
        return new RuleASTCompositeNode_1.RuleASTCompositeNode([]);
    }
    createFromDirective(directive) {
        var _a;
        const ruleStrings = ((_a = directive.arguments) !== null && _a !== void 0 ? _a : [])
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
            const validationRule = (0, exports.parse)(ruleString);
            if (this.ignoreRules.includes(validationRule.name)) {
                return [];
            }
            return Object.assign(Object.assign({}, validationRule), { name: this.mapMethodName(validationRule.name) });
        });
        const isSometimes = ({ name }) => name === 'sometimes';
        const isNotSometimes = ({ name }) => name !== 'sometimes';
        const sometimesIfExists = parsed.filter(isSometimes);
        const others = parsed.filter(isNotSometimes);
        const compositeRule = new RuleASTCompositeNode_1.RuleASTCompositeNode(others.map(({ name, rawArgs }) => new RuleASTSingleNode_1.RuleASTSingleNode(name, rawArgs, this.requiresLazy(name))));
        return sometimesIfExists.length === 0
            ? compositeRule
            : new RuleASTSometimesNode_1.RuleASTSometimesNode(compositeRule, this.requiresLazy('sometimes'));
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
exports.RuleASTFactory = RuleASTFactory;
const parse = (ruleString) => {
    const [name, rest] = ruleString.split(':');
    const rawArgs = rest ? rest.split(',') : [];
    return {
        name,
        rawArgs,
    };
};
exports.parse = parse;
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
