"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputObjectTypeDefinitionFactory = void 0;
class InputObjectTypeDefinitionFactory {
    constructor(registry, visitor, exportTypeStrategy, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            var _a;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            return this.exportTypeStrategy.inputObjectTypeDefinition(name, this.shapeRenderer.render((_a = node.fields) !== null && _a !== void 0 ? _a : []));
        };
    }
}
exports.InputObjectTypeDefinitionFactory = InputObjectTypeDefinitionFactory;
