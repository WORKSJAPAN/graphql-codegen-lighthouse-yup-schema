import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
export class EnumTypeDefinitionFactory {
    enumsAsType;
    registry;
    visitor;
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
        const enumName = this.visitor.convertName(node.name.value);
        const enums = (node.values ?? []).map(enumOption => `'${enumOption.name.value}'`);
        const enumDeclaration = new DeclarationBlock({})
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
        const enumName = this.visitor.convertName(node.name.value);
        const values = (node.values ?? [])
            .map(enumOption => `${enumName}.${this.visitor.convertName(enumOption.name, {
            useTypesPrefix: false,
            transformUnderscore: true,
        })}`)
            .join(', ');
        const enumDeclaration = new DeclarationBlock({})
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
