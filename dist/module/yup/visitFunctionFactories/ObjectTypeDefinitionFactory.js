export class ObjectTypeDefinitionFactory {
    registry;
    visitor;
    withObjectTypesSpec;
    exportTypeStrategy;
    shapeRenderer;
    addUnderscoreToArgsType;
    constructor(registry, visitor, withObjectTypesSpec, exportTypeStrategy, shapeRenderer, addUnderscoreToArgsType = false) {
        this.registry = registry;
        this.visitor = visitor;
        this.withObjectTypesSpec = withObjectTypesSpec;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeRenderer = shapeRenderer;
        this.addUnderscoreToArgsType = addUnderscoreToArgsType;
    }
    create() {
        return (node) => {
            if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node))
                return;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            // Building schema for field arguments.
            const argumentBlocks = this.buildArgumentsSchemaBlock(node, (typeName, field) => {
                this.registry.registerType(typeName);
                return this.exportTypeStrategy.inputObjectTypeDefinition(typeName, this.shapeRenderer.render(field.arguments ?? []));
            });
            const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
            // Building schema for fields.
            const shapeContent = this.shapeRenderer.render(node.fields ?? []);
            return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shapeContent, appendArguments);
        };
    }
    buildArgumentsSchemaBlock(node, callback) {
        const fieldsWithArguments = node.fields?.filter(field => field.arguments && field.arguments.length > 0) ?? [];
        if (fieldsWithArguments.length === 0) {
            return undefined;
        }
        return fieldsWithArguments
            .map(field => {
            const name = node.name.value +
                (this.addUnderscoreToArgsType ? '_' : '') +
                this.visitor.convertName(field, {
                    useTypesPrefix: false,
                    useTypesSuffix: false,
                }) +
                'Args';
            return callback(name, field);
        })
            .join('\n');
    }
}
