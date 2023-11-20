import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTNode } from './RuleASTNode';
import { RuleASTRenderer } from './RuleASTRenderer';
export declare class RuleASTSometimesNode implements RuleASTNode {
    private readonly fieldName;
    private readonly continuation;
    constructor(fieldName: string, // 消したい
    continuation: RuleASTCompositeNode);
    getData(): {
        fieldName: string;
        continuation: RuleASTCompositeNode;
    };
    render(ruleRenderer: RuleASTRenderer): string;
}
