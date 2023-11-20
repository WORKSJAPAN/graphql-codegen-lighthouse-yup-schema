import { CompositeRule } from './CompositeRule';
import { Rule } from './Rule';
import { RuleRenderer } from './RuleRenderer';

// sometimes は特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
export class SometimesRule implements Rule {
  public constructor(
    private readonly fieldName: string, // 消したい
    private readonly continuation: CompositeRule
  ) {}

  public getData() {
    return {
      fieldName: this.fieldName,
      continuation: this.continuation,
    };
  }

  public render(ruleRenderer: RuleRenderer): string {
    return ruleRenderer.renderSometimesRule(this);
  }
}
