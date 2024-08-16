export class ObjectTypeDefinitionFactory {
    registry;
    visitor;
    withObjectTypesSpec;
    exportTypeStrategy;
    shapeFactory;
    shapeRenderer;
    addUnderscoreToArgsType;
    constructor(registry, visitor, withObjectTypesSpec, exportTypeStrategy, shapeFactory, shapeRenderer, addUnderscoreToArgsType = false) {
        this.registry = registry;
        this.visitor = visitor;
        this.withObjectTypesSpec = withObjectTypesSpec;
        this.exportTypeStrategy = exportTypeStrategy;
        this.shapeFactory = shapeFactory;
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
                const shape = this.shapeFactory.create(field.arguments ?? []);
                return this.exportTypeStrategy.inputObjectTypeDefinition(typeName, shape.render(this.shapeRenderer));
            });
            const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
            // Building schema for fields.
            const shape = this.shapeFactory.create(node.fields ?? []);
            return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shape.render(this.shapeRenderer), appendArguments);
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
