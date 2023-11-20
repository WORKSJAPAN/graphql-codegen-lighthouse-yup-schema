import { Kit } from './Kit';
import { Registry } from './registry';
export class YupSchemaVisitor {
    registry = new Registry();
    importBuilder;
    initialEmitter;
    inputObjectTypeDefinitionFactory;
    objectTypeDefinitionFactory;
    enumTypeDefinitionFactory;
    unionTypesDefinitionFactory;
    constructor(schema, config) {
        const kit = new Kit(schema, config);
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
