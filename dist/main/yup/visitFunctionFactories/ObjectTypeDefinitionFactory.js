"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinitionFactory = void 0;
class ObjectTypeDefinitionFactory {
    constructor(registry, visitor, withObjectTypesSpec, exportTypeStrategy, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.withObjectTypesSpec = withObjectTypesSpec;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            var _a;
            if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node))
                return;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            // Building schema for field arguments.
            const argumentBlocks = this.visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
                var _a;
                this.registry.registerType(typeName);
                return this.exportTypeStrategy.inputObjectTypeDefinition(typeName, this.shapeRenderer.render((_a = field.arguments) !== null && _a !== void 0 ? _a : []));
            });
            const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
            // Building schema for fields.
            const shapeContent = this.shapeRenderer.render((_a = node.fields) !== null && _a !== void 0 ? _a : []);
            return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shapeContent, appendArguments);
        };
    }
}
exports.ObjectTypeDefinitionFactory = ObjectTypeDefinitionFactory;
