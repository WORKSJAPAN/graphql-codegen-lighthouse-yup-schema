import { RuleRenderer } from './RuleRenderer';

export interface RuleASTNode {
  render(ruleRenderer: RuleRenderer): string;
}
