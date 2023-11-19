import { GraphQLSchema } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { Interpreter, NewVisitor } from '../types';
import { VisitorFactory } from '../VisitorFactory';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { Registry } from './registry';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { ObjectTypeDefinitionFactory } from './visitFunctionFactories/ObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { createWithObjectTypesSpec } from './withObjectTypesSpecs/factory';

export class YupSchemaVisitor implements NewVisitor, Interpreter {
  private readonly registry: Registry = new Registry();
  private importBuilder: ImportBuilder;
  private initialEmitter: InitialEmitter;
  private readonly inputObjectTypeDefinitionFactory: InputObjectTypeDefinitionFactory;
  private readonly objectTypeDefinitionFactory: ObjectTypeDefinitionFactory;
  private readonly enumTypeDefinitionFactory: EnumTypeDefinitionFactory;
  private readonly unionTypesDefinitionFactory: UnionTypesDefinitionFactory;

  constructor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig) {
    const visitorFactory = new VisitorFactory(schema, config);
    const exportTypeStrategy = createExportTypeStrategy(config.validationSchemaExportType);
    const withObjectTypesSpec = createWithObjectTypesSpec(config.withObjectType);

    this.importBuilder = new ImportBuilder(config.importFrom, config.useTypeImports);
    this.initialEmitter = new InitialEmitter(withObjectTypesSpec);
    this.inputObjectTypeDefinitionFactory = new InputObjectTypeDefinitionFactory(
      config,
      this.registry,
      visitorFactory.createVisitor('input'),
      exportTypeStrategy
    );
    this.objectTypeDefinitionFactory = new ObjectTypeDefinitionFactory(
      config,
      this.registry,
      visitorFactory.createVisitor('output'),
      withObjectTypesSpec,
      exportTypeStrategy
    );
    this.enumTypeDefinitionFactory = new EnumTypeDefinitionFactory(
      config.enumsAsTypes,
      this.registry,
      visitorFactory.createVisitor('both')
    );
    this.unionTypesDefinitionFactory = new UnionTypesDefinitionFactory(
      this.registry,
      visitorFactory.createVisitor('output'),
      withObjectTypesSpec,
      exportTypeStrategy
    );
  }

  buildImports(): string[] {
    return this.importBuilder.build(this.registry.getTypes());
  }

  initialEmit(): string {
    return this.initialEmitter.emit(this.registry.getEnumDeclarations());
  }

  get InputObjectTypeDefinition() {
    return {
      leave: this.inputObjectTypeDefinitionFactory.create(),
    };
  }

  get ObjectTypeDefinition() {
    return {
      leave: this.objectTypeDefinitionFactory.create(),
    };
  }

  get EnumTypeDefinition() {
    return {
      leave: this.enumTypeDefinitionFactory.create(),
    };
  }

  get UnionTypeDefinition() {
    return {
      leave: this.unionTypesDefinitionFactory.create(),
    };
  }
}
