import { FieldDefinitionNode, GraphQLSchema, InputValueDefinitionNode, ObjectTypeDefinitionNode } from 'graphql';

import { ValidationSchemaPluginConfig } from './config';
import { SchemaVisitor } from './types';
import { Visitor } from './visitor';
import { VisitorFactory } from './VisitorFactory';

export abstract class BaseSchemaVisitor implements SchemaVisitor {
  protected importTypes: string[] = [];
  protected enumDeclarations: string[] = [];
  private visitorFactory: VisitorFactory;

  protected constructor(
    protected schema: GraphQLSchema,
    protected config: ValidationSchemaPluginConfig
  ) {
    this.visitorFactory = new VisitorFactory(schema, config);
  }

  abstract importValidationSchema(): string;

  buildImports(): string[] {
    if (this.config.importFrom && this.importTypes.length > 0) {
      return [
        this.importValidationSchema(),
        `import ${this.config.useTypeImports ? 'type ' : ''}{ ${this.importTypes.join(', ')} } from '${
          this.config.importFrom
        }'`,
      ];
    }
    return [this.importValidationSchema()];
  }

  abstract initialEmit(): string;

  createVisitor(scalarDirection: 'input' | 'output' | 'both'): Visitor {
    return this.visitorFactory.createVisitor(scalarDirection);
  }

  protected abstract buildInputFields(
    fields: readonly (FieldDefinitionNode | InputValueDefinitionNode)[],
    visitor: Visitor,
    name: string
  ): string;

  protected buildObjectTypeDefinitionArguments(node: ObjectTypeDefinitionNode, visitor: Visitor) {
    return visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
      this.importTypes.push(typeName);
      return this.buildInputFields(field.arguments ?? [], visitor, typeName);
    });
  }
}
