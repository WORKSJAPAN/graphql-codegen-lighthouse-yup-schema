import { ConstDirectiveNode } from 'graphql';
import { Rules } from '../../../config';
import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTSometimesNode } from './RuleASTSometimesNode';
export declare class RuleASTFactory {
    private rules;
    private ignoreRules;
    private supportedArgumentName;
    constructor(rules?: Rules, ignoreRules?: readonly string[], supportedArgumentName?: string);
    createFromDirectiveOrNull(fieldName: string, directive: ConstDirectiveNode | null): RuleASTSometimesNode | RuleASTCompositeNode;
    createNullObject(): RuleASTCompositeNode;
    createFromDirective(fieldName: string, directive: ConstDirectiveNode): RuleASTSometimesNode | RuleASTCompositeNode;
    private helper;
    private mapMethodName;
}
export type LaravelValidationRule = {
    name: string;
    rawArgs: string[];
};
export declare const parse: (ruleString: string) => LaravelValidationRule;
