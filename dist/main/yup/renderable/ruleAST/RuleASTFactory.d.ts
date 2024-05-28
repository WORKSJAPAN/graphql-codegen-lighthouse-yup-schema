import { ConstDirectiveNode } from 'graphql';
import { Rules } from '../../../config';
import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTSometimesNode } from './RuleASTSometimesNode';
export declare class RuleASTFactory {
    private readonly rules;
    private readonly ignoreRules;
    private readonly lazyRules;
    private readonly supportedArgumentName;
    constructor(rules?: Rules, ignoreRules?: readonly string[], lazyRules?: readonly string[], supportedArgumentName?: string);
    createFromDirectiveOrNull(directive: ConstDirectiveNode | null): RuleASTSometimesNode | RuleASTCompositeNode;
    createNullObject(): RuleASTCompositeNode;
    createFromDirective(directive: ConstDirectiveNode): RuleASTSometimesNode | RuleASTCompositeNode;
    private helper;
    private mapMethodName;
    private requiresLazy;
}
export type LaravelValidationRule = {
    name: string;
    rawArgs: string[];
};
export declare const parse: (ruleString: string) => LaravelValidationRule;
