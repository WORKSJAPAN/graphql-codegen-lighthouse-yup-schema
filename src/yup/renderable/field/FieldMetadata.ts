import { Rule } from '../rules/Rule';

export class FieldMetadata {
  constructor(
    private readonly name: string,
    private readonly isOptional: boolean,
    private readonly rule: Rule,
    private readonly ruleForArray: Rule
  ) {}

  public getData() {
    return {
      name: this.name,
      isOptional: this.isOptional,
      rule: this.rule,
      ruleForArray: this.ruleForArray,
    };
  }
}
