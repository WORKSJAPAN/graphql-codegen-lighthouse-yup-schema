export class InputObjectTypeDefinitionFactory {
    registry;
    visitor;
    exportTypeStrategy;
    shapeRenderer;
    constructor(registry, visitor, exportTypeStrategy, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            return this.exportTypeStrategy.inputObjectTypeDefinition(name, this.shapeRenderer.render(node.fields ?? []));
        };
    }
}
