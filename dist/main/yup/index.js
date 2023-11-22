"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YupSchemaVisitor = void 0;
const Kit_1 = require("./Kit");
const registry_1 = require("./registry");
class YupSchemaVisitor {
    constructor(schema, config) {
        this.registry = new registry_1.Registry();
        const kit = new Kit_1.Kit(schema, config);
        this.importBuilder = kit.getImportBuilder();
        this.initialEmitter = kit.getInitialEmitter();
        this.inputObjectTypeDefinitionFactory = kit.getInputObjectTypeDefinitionFactory(this.registry);
        this.objectTypeDefinitionFactory = kit.getObjectTypeDefinitionFactory(this.registry);
        this.enumTypeDefinitionFactory = kit.getEnumTypeDefinitionFactory(this.registry);
        this.unionTypesDefinitionFactory = kit.getUnionTypesDefinitionFactory(this.registry);
    }
    buildImports() {
        return this.importBuilder.build(this.registry.getTypes());
    }
    initialEmit() {
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
exports.YupSchemaVisitor = YupSchemaVisitor;
