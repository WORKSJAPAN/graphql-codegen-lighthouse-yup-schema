import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { DirectiveRenderer } from '../../DirectiveRenderer';
import { NodeFactory } from '../NodeFactory';
import { RuleFactory } from '../rules/RuleFactory';
import { Field } from './Field';
import { FieldMetadata } from './FieldMetadata';

export class FieldFactory {
  public constructor(
    private readonly nodeFactory: NodeFactory,
    private readonly ruleFactory: RuleFactory,
    private readonly directiveRenderer: DirectiveRenderer
  ) {}

  public create(graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode): Field {
    const generatedCodesForDirectives = this.directiveRenderer.render(
      graphQLFieldNode.name.value,
      graphQLFieldNode.directives ?? []
    );

    const metadata = new FieldMetadata(generatedCodesForDirectives, graphQLFieldNode);

    return new Field(metadata, this.nodeFactory.create(graphQLFieldNode.type));
  }
}
