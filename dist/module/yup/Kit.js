import { Visitor } from '../visitor';
import { ConstExportTypeStrategy } from './exportTypeStrategies/ConstExportTypeStrategy';
import { FunctionExportTypeStrategy } from './exportTypeStrategies/FunctionExportTypeStrategy';
import { ImportBuilder } from './ImportBuilder';
import { InitialEmitter } from './InitialEmitter';
import { FieldFactory } from './renderable/field/FieldFactory';
import { FieldRenderer } from './renderable/field/FieldRenderer';
import { RuleASTFactory } from './renderable/ruleAST/RuleASTFactory';
import { RuleASTRenderer } from './renderable/ruleAST/RuleASTRenderer';
import { TypeASTFactory } from './renderable/typeAST/TypeASTFactory';
import { TypeASTRenderer } from './renderable/typeAST/TypeASTRenderer';
import { ShapeRenderer } from './ShapeRenderer';
import { EnumTypeDefinitionFactory } from './visitFunctionFactories/EnumTypeDefinitionFactory';
import { InputObjectTypeDefinitionFactory } from './visitFunctionFactories/InputObjectTypeDefinitionFactory';
import { ObjectTypeDefinitionFactory } from './visitFunctionFactories/ObjectTypeDefinitionFactory';
import { UnionTypesDefinitionFactory } from './visitFunctionFactories/UnionTypesDefinitionFactory';
import { AllWithObjectTypesSpec } from './withObjectTypesSpecs/AllWithObjectTypesSpec';
import { NoReservedWithObjectTypesSpec } from './withObjectTypesSpecs/NoReservedWithObjectTypesSpec';
import { NullWithObjectTypesSpec } from './withObjectTypesSpecs/NullWithObjectTypesSpec';
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
    getExportTypesStrategy() {
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
    getFieldRenderer() {
        return new FieldRenderer(this.getTypeASTRenderer());
    }
    getTypeASTRenderer() {
        return new TypeASTRenderer(this.config, this.getRuleASTRenderer(), this.getExportTypesStrategy());
    }
    getRuleASTFactory() {
        return new RuleASTFactory(this.config.rules, this.config.ignoreRules, this.config.lazyRules);
    }
    getRuleASTRenderer() {
        return new RuleASTRenderer();
    }
    getShapeRenderer(scalarDirection) {
        return new ShapeRenderer(this.getFieldRenderer(), this.getFieldFactory(scalarDirection));
    }
    getTypeASTFactory(scalarDirection) {
        return new TypeASTFactory(this.config.lazyTypes, scalarDirection, this.getVisitor());
    }
    getFieldFactory(scalarDirection) {
        return new FieldFactory(this.getTypeASTFactory(scalarDirection), this.getRuleASTFactory());
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
        return new ObjectTypeDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy(), this.getShapeRenderer('output'), this.config.addUnderscoreToArgsType);
    }
    getEnumTypeDefinitionFactory(registry) {
        return new EnumTypeDefinitionFactory(this.config.enumsAsTypes, registry, this.getVisitor());
    }
    getUnionTypesDefinitionFactory(registry) {
        return new UnionTypesDefinitionFactory(registry, this.getVisitor(), this.getWithObjectTypesSpec(), this.getExportTypesStrategy());
    }
}
function assertNever(type) {
    throw new Error(`undefined type ${type}`);
}
