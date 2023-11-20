import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { GeneratedCodesForDirectives } from '../../DirectiveRenderer';
import { Rule } from '../rules/Rule';

export class FieldMetadata {
  constructor(
    readonly generatedCodesForDirectives: GeneratedCodesForDirectives,
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

  /**
   * @deprecated
   */
  public getGeneratedCodesForDirectives(): GeneratedCodesForDirectives {
    return this.generatedCodesForDirectives;
  }
}
