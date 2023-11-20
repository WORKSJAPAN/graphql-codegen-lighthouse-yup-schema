import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { NodeFactory } from '../NodeFactory';
import { RuleFactory } from '../rules/RuleFactory';
import { Field } from './Field';

export class FieldFactory {
  public constructor(
    private readonly nodeFactory: NodeFactory,
    private readonly ruleFactory: RuleFactory
  ) {}

  public create(graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode): Field {
    return new Field(graphQLFieldNode, this.nodeFactory.create(graphQLFieldNode.type));
  }
}
