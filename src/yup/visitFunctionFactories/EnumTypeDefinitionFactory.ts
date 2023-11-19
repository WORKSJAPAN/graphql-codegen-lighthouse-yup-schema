import { EnumTypeDefinitionNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../config';
import { VisitorFactory } from '../../VisitorFactory';
import { EnumDeclarationStrategy } from '../enumDeclarationStrategy/EnumDeclarationStrategy';
import { createEnumDeclarationStrategy } from '../enumDeclarationStrategy/factory';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';

export class EnumTypeDefinitionFactory implements VisitFunctionFactory<EnumTypeDefinitionNode> {
  private readonly enumDeclarationStrategy: EnumDeclarationStrategy;

  constructor(
    config: ValidationSchemaPluginConfig,
    private readonly registry: Registry,
    private readonly visitorFactory: VisitorFactory
  ) {
    this.enumDeclarationStrategy = createEnumDeclarationStrategy(
      config.enumsAsTypes,
      this.visitorFactory.createVisitor('both')
    );
  }

  create() {
    return (node: EnumTypeDefinitionNode) => {
      const visitor = this.visitorFactory.createVisitor('both');
      const enumName = visitor.convertName(node.name.value);
      const enumDeclaration = this.enumDeclarationStrategy.enumDeclaration(enumName, node.values ?? []);
      this.registry.registerType(enumName);
      this.registry.registerEnumDeclaration(enumDeclaration);
    };
  }
}
