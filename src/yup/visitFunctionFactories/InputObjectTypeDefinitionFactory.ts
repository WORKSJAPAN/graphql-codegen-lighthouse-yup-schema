import { InputObjectTypeDefinitionNode } from 'graphql';

import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { FieldRenderer } from '../FieldRenderer';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';

export class InputObjectTypeDefinitionFactory implements VisitFunctionFactory<InputObjectTypeDefinitionNode> {
  constructor(
    private readonly registry: Registry,
    private readonly visitor: Visitor,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly fieldRenderer: FieldRenderer
  ) {}

  create() {
    return (node: InputObjectTypeDefinitionNode) => {
      const name = this.visitor.convertName(node.name.value);
      this.registry.registerType(name);
      const shapeContent = this.fieldRenderer.renderFieldsShapeContent(node.fields ?? []);
      return this.exportTypeStrategy.buildInputFields(shapeContent, name);
    };
  }
}
