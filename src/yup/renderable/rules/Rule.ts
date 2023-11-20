import { RuleRenderer } from './RuleRenderer';

export interface Rule {
  render(ruleRenderer: RuleRenderer): string;
}
