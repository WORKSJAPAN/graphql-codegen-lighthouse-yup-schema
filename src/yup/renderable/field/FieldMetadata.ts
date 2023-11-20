import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { Rule } from '../rules/Rule';

export class FieldMetadata {
  constructor(
    private readonly graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode,
    private readonly rule: Rule,
    private readonly ruleForArray: Rule
  ) {}

  public getGraphQLFieldNode() {
    return this.graphQLFieldNode;
  }

  getRule() {
    return this.rule;
  }

  getRuleForArray() {
    return this.ruleForArray;
  }
}
