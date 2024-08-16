import { RuleASTNode } from './RuleASTNode';
import { RuleASTRenderer } from './RuleASTRenderer';
export declare class RuleASTCompositeNode implements RuleASTNode {
    private readonly children;
    constructor(children: readonly RuleASTNode[]);
    getData(): {
        children: readonly RuleASTNode[];
    };
    render(ruleRenderer: RuleASTRenderer): string;
    requiresLazy(): boolean;
}
