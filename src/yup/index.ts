import { GraphQLSchema } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { Interpreter, NewVisitor } from '../types';
import { VisitorFactory } from '../VisitorFactory';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { Registry } from './registry';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { createWithObjectTypesSpec } from './withObjectTypesSpecs/factory';
import { ObjectTypeDefinitionFactory } from './withObjectTypesSpecs/ObjectTypeDefinitionFactory';
import { WithObjectTypesSpec } from './withObjectTypesSpecs/WithObjectTypesSpec';

export class YupSchemaVisitor implements NewVisitor, Interpreter {
  private readonly registry: Registry;
  private exportTypeStrategy: ExportTypeStrategy;
  private visitorFactory: VisitorFactory;
  private importBuilder: ImportBuilder;
  private initialEmitter: InitialEmitter;
  private withObjectTypesSpec: WithObjectTypesSpec;
  private readonly inputObjectTypeDefinitionFactory: InputObjectTypeDefinitionFactory;
  private readonly objectTypeDefinitionFactory: ObjectTypeDefinitionFactory;
  private readonly enumTypeDefinitionFactory: EnumTypeDefinitionFactory;
  private readonly unionTypesDefinitionFactory: UnionTypesDefinitionFactory;

  constructor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig) {
    this.registry = new Registry();
    this.visitorFactory = new VisitorFactory(schema, config);
    this.exportTypeStrategy = createExportTypeStrategy(config.validationSchemaExportType);
    this.importBuilder = new ImportBuilder(config.importFrom, config.useTypeImports);
    this.initialEmitter = new InitialEmitter(config.withObjectType);
    this.withObjectTypesSpec = createWithObjectTypesSpec(config.withObjectType);
    this.inputObjectTypeDefinitionFactory = new InputObjectTypeDefinitionFactory(
      config,
      this.registry,
      this.visitorFactory
    );
    this.objectTypeDefinitionFactory = new ObjectTypeDefinitionFactory(
      config,
      this.registry,
      this.visitorFactory.createVisitor('output'),
      this.withObjectTypesSpec,
      this.exportTypeStrategy
    );
    this.enumTypeDefinitionFactory = new EnumTypeDefinitionFactory(config, this.registry, this.visitorFactory);
    this.unionTypesDefinitionFactory = new UnionTypesDefinitionFactory(
      this.registry,
      this.visitorFactory.createVisitor('output'),
      createWithObjectTypesSpec(config.withObjectType),
      createExportTypeStrategy(config.validationSchemaExportType)
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
