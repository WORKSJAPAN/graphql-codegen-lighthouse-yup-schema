"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InputObjectTypeDefinitionFactory = void 0;
class InputObjectTypeDefinitionFactory {
    constructor(registry, visitor, exportTypeStrategy, shapeFactory, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeFactory = shapeFactory;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            var _a;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            const shape = this.shapeFactory.create((_a = node.fields) !== null && _a !== void 0 ? _a : []);
            return this.exportTypeStrategy.inputObjectTypeDefinition(name, shape.render(this.shapeRenderer));
        };
    }
}
exports.InputObjectTypeDefinitionFactory = InputObjectTypeDefinitionFactory;
