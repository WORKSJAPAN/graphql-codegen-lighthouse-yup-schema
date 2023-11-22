"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnumTypeDefinitionFactory = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
class EnumTypeDefinitionFactory {
    constructor(enumsAsType = false, registry, visitor) {
        this.enumsAsType = enumsAsType;
        this.registry = registry;
        this.visitor = visitor;
    }
    create() {
        return (node) => {
            const { enumName, enumDeclaration } = this.render(node);
            this.registry.registerType(enumName);
            this.registry.registerEnumDeclaration(enumDeclaration);
        };
    }
    render(node) {
        return this.enumsAsType ? this.renderAsType(node) : this.renderAsConst(node);
    }
    renderAsType(node) {
        var _a;
        const enumName = this.visitor.convertName(node.name.value);
        const enums = ((_a = node.values) !== null && _a !== void 0 ? _a : []).map(enumOption => `'${enumOption.name.value}'`);
        const enumDeclaration = new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${enumName}Schema`)
            .withContent(`yup.string().oneOf([${enums.join(', ')}])`).string;
        return {
            enumName,
            enumDeclaration,
        };
    }
    renderAsConst(node) {
        var _a;
        const enumName = this.visitor.convertName(node.name.value);
        const values = ((_a = node.values) !== null && _a !== void 0 ? _a : [])
            .map(enumOption => `${enumName}.${this.visitor.convertName(enumOption.name, {
            useTypesPrefix: false,
            transformUnderscore: true,
        })}`)
            .join(', ');
        const enumDeclaration = new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${enumName}Schema`)
            .withContent(`yup.string<${enumName}>().oneOf([${values}])`).string;
        return {
            enumName,
            enumDeclaration,
        };
    }
}
exports.EnumTypeDefinitionFactory = EnumTypeDefinitionFactory;
