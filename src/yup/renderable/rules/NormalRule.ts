import { Rule } from './Rule';
import { RuleRenderer } from './RuleRenderer';

export class NormalRule implements Rule {
  public constructor(
    private readonly name: string,
    private readonly args: any[]
  ) {}

  public getData() {
    return {
      name: this.name,
      args: this.args,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderNormalRule(this);
  }
}
