"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NoReservedWithObjectTypesSpec = void 0;
class NoReservedWithObjectTypesSpec {
    shouldUseObjectTypeDefinitionNode(node) {
        return !/^(Query|Mutation|Subscription)$/.test(node.name.value);
    }
    shouldIncludeUnion() {
        return true;
    }
}
exports.NoReservedWithObjectTypesSpec = NoReservedWithObjectTypesSpec;
