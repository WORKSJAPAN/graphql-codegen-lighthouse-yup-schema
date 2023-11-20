import { Rules } from '../../../config';
import { CompositeRule } from './CompositeRule';
import { SingleRule } from './SingleRule';
import { SometimesRule } from './SometimesRule';

export class RuleFactory {
  public constructor(
    private rules: Rules = {},
    private ignoreRules: readonly string[] = []
  ) {}

  create(fieldName: string, ruleStrings: readonly string[]): CompositeRule | SometimesRule {
    const parsed = ruleStrings.flatMap(ruleString => {
      const validationRule = parse(ruleString);

      if (this.ignoreRules.includes(validationRule.name)) {
        return [];
      }

      return {
        ...validationRule,
        name: this.mapMethodName(validationRule.name),
      };
    });
    const isSometimes = ({ name }: LaravelValidationRule) => name === 'sometimes';
    const isNotSometimes = ({ name }: LaravelValidationRule) => name !== 'sometimes';

    const sometimesIfExists = parsed.filter(isSometimes);
    const others = parsed.filter(isNotSometimes);

    const compositeRule = new CompositeRule(others.map(({ name, rawArgs }) => new SingleRule(name, rawArgs)));

    return sometimesIfExists.length === 0 ? compositeRule : new SometimesRule(fieldName, compositeRule);
  }

  private mapMethodName(ruleName: string): string {
    const ruleMapping = this.rules[ruleName];
    if (!ruleMapping) {
      return ruleName;
    }
    if (Array.isArray(ruleMapping)) {
      return ruleMapping[0];
    }
    return ruleMapping;
  }
}

export type LaravelValidationRule = {
  name: string;
  rawArgs: string[];
};

export const parse = (ruleString: string): LaravelValidationRule => {
  const [name, rest] = ruleString.split(':');
  const rawArgs = rest ? rest.split(',') : [];

  return {
    name,
    rawArgs,
  };
};
