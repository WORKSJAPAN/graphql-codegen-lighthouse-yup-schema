import { Rule } from './Rule';
import { RuleRenderer } from './RuleRenderer';

export class SometimesRule implements Rule {
  public constructor(
    private readonly fieldName: string,
    private readonly children: readonly Rule[]
  ) {}

  public getData() {
    return {
      fieldName: this.fieldName,
      children: this.children,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderSometimesRule(this);
  }
}
