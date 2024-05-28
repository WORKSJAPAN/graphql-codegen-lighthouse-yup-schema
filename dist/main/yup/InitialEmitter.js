"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InitialEmitter = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
class InitialEmitter {
    constructor(withObjectTypesSpec) {
        this.withObjectTypesSpec = withObjectTypesSpec;
    }
    emit(enumDeclarations) {
        if (!this.withObjectTypesSpec.shouldIncludeUnion())
            return '\n' + enumDeclarations.join('\n');
        return '\n' + enumDeclarations.join('\n') + '\n' + this.unionFunctionDeclaration();
    }
    unionFunctionDeclaration() {
        return new visitor_plugin_common_1.DeclarationBlock({})
            .asKind('function')
            .withName('union<T extends {}>(schemas: Record<string, yup.ObjectSchema<T>>)')
            .withBlock([
            (0, visitor_plugin_common_1.indent)('return (yup.object<T>() as unknown as yup.ObjectSchema<T>).when('),
            (0, visitor_plugin_common_1.indent)('([value], schema) => schemas[value?.__typename] ?? schema', 2),
            (0, visitor_plugin_common_1.indent)(').defined()'), // HACK: 型を合わせるために、union は undefined を許容しないこととした。問題が出たら考える。
        ].join('\n')).string;
    }
}
exports.InitialEmitter = InitialEmitter;
