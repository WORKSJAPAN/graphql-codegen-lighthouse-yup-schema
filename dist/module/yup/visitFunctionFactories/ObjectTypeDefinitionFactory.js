export class ObjectTypeDefinitionFactory {
    registry;
    visitor;
    withObjectTypesSpec;
    exportTypeStrategy;
    shapeRenderer;
    constructor(registry, visitor, withObjectTypesSpec, exportTypeStrategy, shapeRenderer) {
        this.registry = registry;
        this.visitor = visitor;
        this.withObjectTypesSpec = withObjectTypesSpec;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeRenderer = shapeRenderer;
    }
    create() {
        return (node) => {
            if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node))
                return;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            // Building schema for field arguments.
            const argumentBlocks = this.visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
                this.registry.registerType(typeName);
                return this.exportTypeStrategy.inputObjectTypeDefinition(typeName, this.shapeRenderer.render(field.arguments ?? []));
            });
            const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
            // Building schema for fields.
            const shapeContent = this.shapeRenderer.render(node.fields ?? []);
            return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shapeContent, appendArguments);
        };
    }
}
