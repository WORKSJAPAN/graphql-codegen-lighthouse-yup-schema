import { RuleASTNode } from './RuleASTNode';
import { RuleRenderer } from './RuleRenderer';

export class RuleASTCompositeNode implements RuleASTNode {
  public constructor(private readonly children: readonly RuleASTNode[]) {}

  public getData() {
    return {
      children: this.children,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderCompositeRule(this);
  }
}
