import { Visitor } from '../visitor';
import { DirectiveRenderer } from './DirectiveRenderer';
import { createExportTypeStrategy } from './exportTypeStrategies/factory';
import { FieldRenderer } from './FieldRenderer';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { ScalarRenderer } from './ScalarRenderer';
import { ShapeRenderer } from './ShapeRenderer';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { ObjectTypeDefinitionFactory } from './visitFunctionFactories/ObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { createWithObjectTypesSpec } from './withObjectTypesSpecs/factory';
export class Kit {
    schema;
    config;
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
    }
    getVisitor() {
        return new Visitor(this.schema, this.config);
    }
    getWithObjectTypesSpec() {
        return createWithObjectTypesSpec(this.config.withObjectType);
    }
    getExportTypesStrategy() {
        return createExportTypeStrategy(this.config.validationSchemaExportType);
    }
    getFieldRenderer(scalarDirection) {
        return new FieldRenderer(this.config, this.getVisitor(), this.getExportTypesStrategy(), this.getDirectiveRenderer(), this.getScalarRenderer(), scalarDirection);
    }
    getScalarRenderer() {
        return new ScalarRenderer(this.config.scalarSchemas, this.getVisitor());
    }
    getDirectiveRenderer() {
        return new DirectiveRenderer(this.config.rules, this.config.ignoreRules);
    }
    getShapeRenderer(scalarDirection) {
        return new ShapeRenderer(this.getFieldRenderer(scalarDirection));
    }
    getImportBuilder() {
        return new ImportBuilder(this.config.importFrom, this.config.useTypeImports);
    }
    getInitialEmitter() {
        return new InitialEmitter(this.getWithObjectTypesSpec());
    }
    getInputObjectTypeDefinitionFactory(registry) {
        return new InputObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getExportTypesStrategy(), this.getShapeRenderer('input'));
    }
    getObjectTypeDefinitionFactory(registry) {
        return new ObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy(), this.getShapeRenderer('output'));
    }
    getEnumTypeDefinitionFactory(registry) {
        return new EnumTypeDefinitionFactory(this.config.enumsAsTypes, registry, this.getVisitor());
    }
    getUnionTypesDefinitionFactory(registry) {
        return new UnionTypesDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy());
    }
}
