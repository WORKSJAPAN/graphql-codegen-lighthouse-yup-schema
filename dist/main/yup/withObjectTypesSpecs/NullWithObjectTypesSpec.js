"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NullWithObjectTypesSpec = void 0;
class NullWithObjectTypesSpec {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    shouldUseObjectTypeDefinitionNode(node) {
        return false;
    }
    shouldIncludeUnion() {
        return false;
    }
}
exports.NullWithObjectTypesSpec = NullWithObjectTypesSpec;
