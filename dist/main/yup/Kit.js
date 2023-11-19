"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kit = void 0;
const visitor_1 = require("../visitor");
const DirectiveRenderer_1 = require("./DirectiveRenderer");
const factory_1 = require("./exportTypeStrategies/factory");
const FieldRenderer_1 = require("./FieldRenderer");
const ImportBuilder_1 = require("./ImportBuilder");
const InitialEmitter_1 = require("./InitialEmitter");
const ScalarRenderer_1 = require("./ScalarRenderer");
const ShapeRenderer_1 = require("./ShapeRenderer");
const EnumTypeDefinitionFactory_1 = require("./visitFunctionFactories/EnumTypeDefinitionFactory");
const InputObjectTypeDefinitionFactory_1 = require("./visitFunctionFactories/InputObjectTypeDefinitionFactory");
const ObjectTypeDefinitionFactory_1 = require("./visitFunctionFactories/ObjectTypeDefinitionFactory");
const UnionTypesDefinitionFactory_1 = require("./visitFunctionFactories/UnionTypesDefinitionFactory");
const factory_2 = require("./withObjectTypesSpecs/factory");
class Kit {
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
    }
    getVisitor() {
        return new visitor_1.Visitor(this.schema, this.config);
    }
    getWithObjectTypesSpec() {
        return (0, factory_2.createWithObjectTypesSpec)(this.config.withObjectType);
    }
    getExportTypesStrategy() {
        return (0, factory_1.createExportTypeStrategy)(this.config.validationSchemaExportType);
    }
    getFieldRenderer(scalarDirection) {
        return new FieldRenderer_1.FieldRenderer(this.config, this.getVisitor(), this.getExportTypesStrategy(), this.getDirectiveRenderer(), this.getScalarRenderer(), scalarDirection);
    }
    getScalarRenderer() {
        return new ScalarRenderer_1.ScalarRenderer(this.config.scalarSchemas, this.getVisitor());
    }
    getDirectiveRenderer() {
        return new DirectiveRenderer_1.DirectiveRenderer(this.config.rules, this.config.ignoreRules);
    }
    getShapeRenderer(scalarDirection) {
        return new ShapeRenderer_1.ShapeRenderer(this.getFieldRenderer(scalarDirection));
    }
    getImportBuilder() {
        return new ImportBuilder_1.ImportBuilder(this.config.importFrom, this.config.useTypeImports);
    }
    getInitialEmitter() {
        return new InitialEmitter_1.InitialEmitter(this.getWithObjectTypesSpec());
    }
    getInputObjectTypeDefinitionFactory(registry) {
        return new InputObjectTypeDefinitionFactory_1.InputObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getExportTypesStrategy(), this.getShapeRenderer('input'));
    }
    getObjectTypeDefinitionFactory(registry) {
        return new ObjectTypeDefinitionFactory_1.ObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy(), this.getShapeRenderer('output'));
    }
    getEnumTypeDefinitionFactory(registry) {
        return new EnumTypeDefinitionFactory_1.EnumTypeDefinitionFactory(this.config.enumsAsTypes, registry, this.getVisitor());
    }
    getUnionTypesDefinitionFactory(registry) {
        return new UnionTypesDefinitionFactory_1.UnionTypesDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy());
    }
}
exports.Kit = Kit;
