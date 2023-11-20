import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { GeneratedCodesForDirectives } from '../../DirectiveRenderer';

export class FieldMetadata {
  constructor(
    readonly generatedCodesForDirectives: GeneratedCodesForDirectives,
    private readonly graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode
  ) {}

  public getGraphQLFieldNode() {
    return this.graphQLFieldNode;
  }

  public getGeneratedCodesForDirectives(): GeneratedCodesForDirectives {
    return this.generatedCodesForDirectives;
  }
}
