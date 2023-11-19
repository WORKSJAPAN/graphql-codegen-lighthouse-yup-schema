import { ObjectTypeDefinitionNode } from 'graphql';

import { isNonNullType } from '../../graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { FieldRenderer } from '../FieldRenderer';
import { Registry } from '../registry';
import { WithObjectTypesSpec } from '../withObjectTypesSpecs/WithObjectTypesSpec';
import { VisitFunctionFactory } from './types';

export class ObjectTypeDefinitionFactory implements VisitFunctionFactory<ObjectTypeDefinitionNode> {
  constructor(
    private readonly registry: Registry,
    private readonly visitor: Visitor,
    private readonly withObjectTypesSpec: WithObjectTypesSpec,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly fieldRenderer: FieldRenderer
  ) {}

  create() {
    return (node: ObjectTypeDefinitionNode) => {
      if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node)) return;

      const name = this.visitor.convertName(node.name.value);
      this.registry.registerType(name);

      // Building schema for field arguments.
      const argumentBlocks = this.visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
        this.registry.registerType(typeName);
        return this.fieldRenderer.renderInputField(field.arguments ?? [], typeName);
      });
      const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';

      // Building schema for fields.
      const shape =
        node.fields
          ?.map(field => {
            return this.fieldRenderer.renderField(field, 2);
          })
          .join(',\n') ?? '';

      return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shape, appendArguments);
    };
  }
}
