"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ObjectTypeDefinitionFactory = void 0;
class ObjectTypeDefinitionFactory {
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
            var _a;
            if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node))
                return;
            const name = this.visitor.convertName(node.name.value);
            this.registry.registerType(name);
            // Building schema for field arguments.
            const argumentBlocks = this.buildArgumentsSchemaBlock(node, (typeName, field) => {
                var _a;
                this.registry.registerType(typeName);
                const shape = this.shapeFactory.create((_a = field.arguments) !== null && _a !== void 0 ? _a : []);
                return this.exportTypeStrategy.inputObjectTypeDefinition(typeName, shape.render(this.shapeRenderer));
            });
            const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
            // Building schema for fields.
            const shape = this.shapeFactory.create((_a = node.fields) !== null && _a !== void 0 ? _a : []);
            return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shape.render(this.shapeRenderer), appendArguments);
        };
    }
    buildArgumentsSchemaBlock(node, callback) {
        var _a, _b;
        const fieldsWithArguments = (_b = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.filter(field => field.arguments && field.arguments.length > 0)) !== null && _b !== void 0 ? _b : [];
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
exports.ObjectTypeDefinitionFactory = ObjectTypeDefinitionFactory;
