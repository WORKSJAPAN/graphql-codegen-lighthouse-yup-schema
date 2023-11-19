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
                var _a;
                const element = this.visitor.convertName(t.name.value);
                const typ = this.visitor.getType(t.name.value);
                return this.exportTypeStrategy.schemaEvaluation(`${element}Schema`, (_a = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _a === void 0 ? void 0 : _a.kind);
            }).join(', ');
            return this.exportTypeStrategy.unionTypeDefinition(unionName, unionElements);
        };
    }
}
exports.UnionTypesDefinitionFactory = UnionTypesDefinitionFactory;
