import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { Rule } from '../rules/Rule';

export class FieldMetadata {
  constructor(
    private readonly name: string,
    private readonly graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode,
    private readonly rule: Rule,
    private readonly ruleForArray: Rule
  ) {}

  public getData() {
    return {
      name: this.name,
      graphQLFieldNode: this.graphQLFieldNode,
      rule: this.rule,
      ruleForArray: this.ruleForArray,
    };
  }
}
