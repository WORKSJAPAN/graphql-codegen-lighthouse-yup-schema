import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTNode } from './RuleASTNode';
import { RuleASTRenderer } from './RuleASTRenderer';
export declare class RuleASTSometimesNode implements RuleASTNode {
    private readonly continuation;
    private readonly _requiresLazy;
    constructor(continuation: RuleASTCompositeNode, _requiresLazy: boolean);
    getData(): {
        continuation: RuleASTCompositeNode;
    };
    render(ruleRenderer: RuleASTRenderer): string;
    requiresLazy(): boolean;
}
