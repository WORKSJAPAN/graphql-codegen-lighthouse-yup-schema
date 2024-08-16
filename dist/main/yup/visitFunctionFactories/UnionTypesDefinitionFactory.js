"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnionTypesDefinitionFactory = void 0;
class UnionTypesDefinitionFactory {
    constructor(registry, visitor, withObjectTypesSpec, exportTypeStrategy) {
        this.registry = registry;
        this.visitor = visitor;
        this.withObjectTypesSpec = withObjectTypesSpec;
        this.exportTypeStrategy = exportTypeStrategy;
    }
    create() {
        if (!this.withObjectTypesSpec.shouldIncludeUnion())
            return;
        return (node) => {
            var _a;
            if (!node.types)
                return;
            const unionName = this.visitor.convertName(node.name.value);
            this.registry.registerType(unionName);
            const unionElements = (_a = node.types) === null || _a === void 0 ? void 0 : _a.map(t => {
                const element = this.visitor.convertName(t.name.value);
                const kind = this.visitor.getKind(t.name.value);
                return `${element}: ${this.exportTypeStrategy.schemaEvaluation(`${element}Schema`, kind)},`;
            }).join('\n');
            return this.exportTypeStrategy.unionTypeDefinition(unionName, ['{', unionElements, '}'].join('\n'));
        };
    }
}
exports.UnionTypesDefinitionFactory = UnionTypesDefinitionFactory;
