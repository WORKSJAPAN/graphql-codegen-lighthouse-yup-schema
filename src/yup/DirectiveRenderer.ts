import { ConstDirectiveNode } from 'graphql';

import { CompositeRule } from './renderable/rules/CompositeRule';
import { Rule } from './renderable/rules/Rule';
import { RuleFactory } from './renderable/rules/RuleFactory';

export class DirectiveRenderer {
  constructor(private readonly ruleFactory: RuleFactory) {}

  public createMany(fieldName: string, directives: readonly ConstDirectiveNode[]): Record<string, Rule> {
    const ret: Record<string, Rule> = {
      rules: new CompositeRule([]),
      rulesForArray: new CompositeRule([]),
    };

    for (const directive of directives) {
      if (this.ruleFactory.supports(directive)) {
        ret[directive.name.value] = this.ruleFactory.createFromDirective(fieldName, directive);
      }
    }

    return ret;
  }
}
