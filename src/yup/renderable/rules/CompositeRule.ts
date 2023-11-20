import { Rule } from './Rule';
import { RuleRenderer } from './RuleRenderer';

export class CompositeRule implements Rule {
  public constructor(private readonly children: readonly Rule[]) {}

  public getData() {
    return {
      children: this.children,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderCompositeRule(this);
  }
}
