export class InputObjectTypeDefinitionFactory {
    registry;
    visitor;
    exportTypeStrategy;
    shapeFactory;
    shapeRenderer;
    constructor(registry, visitor, exportTypeStrategy, shapeFactory, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeFactory = shapeFactory;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            const shape = this.shapeFactory.create(node.fields ?? []);
            return this.exportTypeStrategy.inputObjectTypeDefinition(name, shape.render(this.shapeRenderer));
        };
    }
}
