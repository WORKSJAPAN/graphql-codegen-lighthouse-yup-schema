import { RuleASTCompositeNode } from './RuleASTCompositeNode';
import { RuleASTSingleNode } from './RuleASTSingleNode';
import { RuleASTSometimesNode } from './RuleASTSometimesNode';
export declare class RuleASTRenderer {
    renderSingleRule(singleRule: RuleASTSingleNode): string;
    renderCompositeRule(compositeRule: RuleASTCompositeNode): string;
    renderSometimesRule(sometimesRule: RuleASTSometimesNode): string;
}
