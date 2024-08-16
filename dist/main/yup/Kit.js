"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Kit = void 0;
const visitor_1 = require("../visitor");
const ConstExportTypeStrategy_1 = require("./exportTypeStrategies/ConstExportTypeStrategy");
const FunctionExportTypeStrategy_1 = require("./exportTypeStrategies/FunctionExportTypeStrategy");
const ImportBuilder_1 = require("./ImportBuilder");
const InitialEmitter_1 = require("./InitialEmitter");
const FieldFactory_1 = require("./renderable/field/FieldFactory");
const FieldRenderer_1 = require("./renderable/field/FieldRenderer");
const RuleASTFactory_1 = require("./renderable/ruleAST/RuleASTFactory");
const RuleASTRenderer_1 = require("./renderable/ruleAST/RuleASTRenderer");
const ShapeFactory_1 = require("./renderable/shape/ShapeFactory");
const ShapeRenderer_1 = require("./renderable/shape/ShapeRenderer");
const TypeASTFactory_1 = require("./renderable/typeAST/TypeASTFactory");
const TypeASTRenderer_1 = require("./renderable/typeAST/TypeASTRenderer");
const EnumTypeDefinitionFactory_1 = require("./visitFunctionFactories/EnumTypeDefinitionFactory");
const InputObjectTypeDefinitionFactory_1 = require("./visitFunctionFactories/InputObjectTypeDefinitionFactory");
const ObjectTypeDefinitionFactory_1 = require("./visitFunctionFactories/ObjectTypeDefinitionFactory");
const UnionTypesDefinitionFactory_1 = require("./visitFunctionFactories/UnionTypesDefinitionFactory");
const AllWithObjectTypesSpec_1 = require("./withObjectTypesSpecs/AllWithObjectTypesSpec");
const NoReservedWithObjectTypesSpec_1 = require("./withObjectTypesSpecs/NoReservedWithObjectTypesSpec");
const NullWithObjectTypesSpec_1 = require("./withObjectTypesSpecs/NullWithObjectTypesSpec");
class Kit {
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
    }
    getVisitor() {
        return new visitor_1.Visitor(this.schema, this.config);
    }
    getWithObjectTypesSpec() {
        var _a;
        const type = (_a = this.config.withObjectType) !== null && _a !== void 0 ? _a : false;
        switch (type) {
            case 'no-reserved':
                return new NoReservedWithObjectTypesSpec_1.NoReservedWithObjectTypesSpec();
            case 'all':
                return new AllWithObjectTypesSpec_1.AllWithObjectTypesSpec();
            case false:
                return new NullWithObjectTypesSpec_1.NullWithObjectTypesSpec();
            default:
                return assertNever(type);
        }
    }
    getExportTypesStrategy() {
        var _a;
        const type = (_a = this.config.validationSchemaExportType) !== null && _a !== void 0 ? _a : 'function';
        switch (type) {
            case 'function':
                return new FunctionExportTypeStrategy_1.FunctionExportTypeStrategy();
            case 'const':
                return new ConstExportTypeStrategy_1.ConstExportTypeStrategy();
            default:
                return assertNever(type);
        }
    }
    getShapeRenderer() {
        return new ShapeRenderer_1.ShapeRenderer(this.getFieldRenderer());
    }
    getFieldRenderer() {
        return new FieldRenderer_1.FieldRenderer(this.getTypeASTRenderer());
    }
    getTypeASTRenderer() {
        return new TypeASTRenderer_1.TypeASTRenderer(this.config, this.getRuleASTRenderer(), this.getExportTypesStrategy());
    }
    getRuleASTRenderer() {
        return new RuleASTRenderer_1.RuleASTRenderer();
    }
    getShapeFactory(scalarDirection) {
        return new ShapeFactory_1.ShapeFactory(this.getFieldFactory(scalarDirection));
    }
    getFieldFactory(scalarDirection) {
        return new FieldFactory_1.FieldFactory(this.getTypeASTFactory(scalarDirection), this.getRuleASTFactory());
    }
    getTypeASTFactory(scalarDirection) {
        return new TypeASTFactory_1.TypeASTFactory(this.config.lazyTypes, scalarDirection, this.getVisitor());
    }
    getRuleASTFactory() {
        return new RuleASTFactory_1.RuleASTFactory(this.config.rules, this.config.ignoreRules, this.config.lazyRules);
    }
    getImportBuilder() {
        return new ImportBuilder_1.ImportBuilder(this.config.importFrom, this.config.useTypeImports);
    }
    getInitialEmitter() {
        return new InitialEmitter_1.InitialEmitter(this.getWithObjectTypesSpec());
    }
    getInputObjectTypeDefinitionFactory(registry) {
        return new InputObjectTypeDefinitionFactory_1.InputObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getExportTypesStrategy(), this.getShapeFactory('input'), this.getShapeRenderer());
    }
    getObjectTypeDefinitionFactory(registry) {
        return new ObjectTypeDefinitionFactory_1.ObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy(), this.getShapeFactory('output'), this.getShapeRenderer(), this.config.addUnderscoreToArgsType);
    }
    getEnumTypeDefinitionFactory(registry) {
        return new EnumTypeDefinitionFactory_1.EnumTypeDefinitionFactory(this.config.enumsAsTypes, registry, this.getVisitor());
    }
    getUnionTypesDefinitionFactory(registry) {
        return new UnionTypesDefinitionFactory_1.UnionTypesDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy());
    }
}
exports.Kit = Kit;
function assertNever(type) {
    throw new Error(`undefined type ${type}`);
}
