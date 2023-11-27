export class NoReservedWithObjectTypesSpec {
    shouldUseObjectTypeDefinitionNode(node) {
        return !/^(Query|Mutation|Subscription)$/.test(node.name.value);
    }
    shouldIncludeUnion() {
        return true;
    }
}
