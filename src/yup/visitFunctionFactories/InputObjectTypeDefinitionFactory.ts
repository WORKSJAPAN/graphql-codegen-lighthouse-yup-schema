import { InputObjectTypeDefinitionNode } from 'graphql';

import { Visitor } from '../../visitor';
import { FieldRenderer } from '../FieldRenderer';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';

export class InputObjectTypeDefinitionFactory implements VisitFunctionFactory<InputObjectTypeDefinitionNode> {
  constructor(
    private readonly registry: Registry,
    private readonly visitor: Visitor,
    private readonly fieldRenderer: FieldRenderer
  ) {}

  create() {
    return (node: InputObjectTypeDefinitionNode) => {
      const name = this.visitor.convertName(node.name.value);
      this.registry.registerType(name);
      return this.fieldRenderer.renderInputField(node.fields ?? [], name);
    };
  }
}
