import { Rule } from './Rule';
import { RuleRenderer } from './RuleRenderer';

export class SingleRule implements Rule {
  public constructor(
    private readonly mappedName: string,
    private readonly rawArgs: readonly string[]
  ) {}

  public getData() {
    return {
      mappedName: this.mappedName,
      rawArgs: this.rawArgs,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderSingleRule(this);
  }
}
