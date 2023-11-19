import { EnumTypeDefinitionNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../config';
import { Visitor } from '../../visitor';
import { EnumDeclarationStrategy } from '../enumDeclarationStrategy/EnumDeclarationStrategy';
import { createEnumDeclarationStrategy } from '../enumDeclarationStrategy/factory';
import { Registry } from '../registry';
import { VisitFunctionFactory } from './types';

export class EnumTypeDefinitionFactory implements VisitFunctionFactory<EnumTypeDefinitionNode> {
  private readonly enumDeclarationStrategy: EnumDeclarationStrategy;

  constructor(
    config: ValidationSchemaPluginConfig,
    private readonly registry: Registry,
    private readonly visitor: Visitor
  ) {
    this.enumDeclarationStrategy = createEnumDeclarationStrategy(config.enumsAsTypes, this.visitor);
  }

  create() {
    return (node: EnumTypeDefinitionNode) => {
      const enumName = this.visitor.convertName(node.name.value);
      const enumDeclaration = this.enumDeclarationStrategy.enumDeclaration(enumName, node.values ?? []);
      this.registry.registerType(enumName);
      this.registry.registerEnumDeclaration(enumDeclaration);
    };
  }
}
