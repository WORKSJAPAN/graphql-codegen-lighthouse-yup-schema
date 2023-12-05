export class UnionTypesDefinitionFactory {
    registry;
    visitor;
    withObjectTypesSpec;
    exportTypeStrategy;
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
            if (!node.types)
                return;
            const unionName = this.visitor.convertName(node.name.value);
            this.registry.registerType(unionName);
            const unionElements = node.types
                ?.map(t => {
                const element = this.visitor.convertName(t.name.value);
                const kind = this.visitor.getKind(t.name.value);
                return `${element}: ${this.exportTypeStrategy.schemaEvaluation(`${element}Schema`, kind)},`;
            })
                .join('\n');
            return this.exportTypeStrategy.unionTypeDefinition(unionName, ['{', unionElements, '}'].join('\n'));
        };
    }
}
