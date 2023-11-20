import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { Visitor } from '../visitor';
import { ConstExportTypeStrategy } from './exportTypeStrategies/ConstExportTypeStrategy';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { FunctionExportTypeStrategy } from './exportTypeStrategies/FunctionExportTypeStrategy';
import { FieldRenderer } from './FieldRenderer';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { Registry } from './registry';
import { FieldFactory } from './renderable/field/FieldFactory';
import { NodeFactory } from './renderable/NodeFactory';
import { RuleFactory } from './renderable/rules/RuleFactory';
import { RuleRenderer } from './renderable/rules/RuleRenderer';
import { ScalarRenderer } from './ScalarRenderer';
import { ShapeRenderer } from './ShapeRenderer';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { ObjectTypeDefinitionFactory } from './visitFunctionFactories/ObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { AllWithObjectTypesSpec } from './withObjectTypesSpecs/AllWithObjectTypesSpec';
import { NoReservedWithObjectTypesSpec } from './withObjectTypesSpecs/NoReservedWithObjectTypesSpec';
import { NullWithObjectTypesSpec } from './withObjectTypesSpecs/NullWithObjectTypesSpec';
import { WithObjectTypesSpec } from './withObjectTypesSpecs/WithObjectTypesSpec';

export class Kit {
  constructor(
    private readonly schema: GraphQLSchema,
    private readonly config: ValidationSchemaPluginConfig
  ) {}

  getVisitor() {
    return new Visitor(this.schema, this.config);
  }

  getWithObjectTypesSpec(): WithObjectTypesSpec {
    const type = this.config.withObjectType ?? false;
    switch (type) {
      case 'no-reserved':
        return new NoReservedWithObjectTypesSpec();
      case 'all':
        return new AllWithObjectTypesSpec();
      case false:
        return new NullWithObjectTypesSpec();
      default:
        return assertNever(type);
    }
  }

  getExportTypesStrategy(): ExportTypeStrategy {
    const type = this.config.validationSchemaExportType ?? 'function';
    switch (type) {
      case 'function':
        return new FunctionExportTypeStrategy();
      case 'const':
        return new ConstExportTypeStrategy();
      default:
        return assertNever(type);
    }
  }

  getFieldRenderer(scalarDirection: keyof NormalizedScalarsMap[string]) {
    return new FieldRenderer(
      this.config,
      this.getVisitor(),
      this.getRuleRenderer(),
      this.getExportTypesStrategy(),
      this.getScalarRenderer(),
      scalarDirection
    );
  }

  getScalarRenderer() {
    return new ScalarRenderer(this.config.scalarSchemas, this.getVisitor());
  }

  getRuleFactory() {
    return new RuleFactory(this.config.rules, this.config.ignoreRules);
  }

  getRuleRenderer() {
    return new RuleRenderer();
  }

  getShapeRenderer(scalarDirection: keyof NormalizedScalarsMap[string]) {
    return new ShapeRenderer(this.getFieldRenderer(scalarDirection), this.getFieldFactory());
  }

  getNodeFactory() {
    return new NodeFactory(this.config.lazyTypes);
  }

  getFieldFactory() {
    return new FieldFactory(this.getNodeFactory(), this.getRuleFactory());
  }

  getImportBuilder() {
    return new ImportBuilder(this.config.importFrom, this.config.useTypeImports);
  }

  getInitialEmitter() {
    return new InitialEmitter(this.getWithObjectTypesSpec());
  }

  getInputObjectTypeDefinitionFactory(registry: Registry) {
    return new InputObjectTypeDefinitionFactory(
      registry,
      this.getVisitor(),
      this.getExportTypesStrategy(),
      this.getShapeRenderer('input')
    );
  }

  getObjectTypeDefinitionFactory(registry: Registry) {
    return new ObjectTypeDefinitionFactory(
      registry,
      this.getVisitor(),
      this.getWithObjectTypesSpec(),
      this.getExportTypesStrategy(),
      this.getShapeRenderer('output'),
      this.config.addUnderscoreToArgsType
    );
  }

  getEnumTypeDefinitionFactory(registry: Registry) {
    return new EnumTypeDefinitionFactory(this.config.enumsAsTypes, registry, this.getVisitor());
  }

  getUnionTypesDefinitionFactory(registry: Registry) {
    return new UnionTypesDefinitionFactory(
      registry,
      this.getVisitor(),
      this.getWithObjectTypesSpec(),
      this.getExportTypesStrategy()
    );
  }
}

function assertNever(type: never): never {
  throw new Error(`undefined type ${type}`);
}
