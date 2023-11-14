"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YupSchemaVisitor = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const directive_1 = require("../directive");
const schema_visitor_1 = require("../schema_visitor");
const graphql_1 = require("./../graphql");
class YupSchemaVisitor extends schema_visitor_1.BaseSchemaVisitor {
    constructor(schema, config) {
        super(schema, config);
    }
    importValidationSchema() {
        return `import * as yup from 'yup'`;
    }
    initialEmit() {
        if (!this.config.withObjectType)
            return '\n' + this.enumDeclarations.join('\n');
        return ('\n' +
            this.enumDeclarations.join('\n') +
            '\n' +
            new visitor_plugin_common_1.DeclarationBlock({})
                .asKind('function')
                .withName('union<T extends {}>(...schemas: ReadonlyArray<yup.Schema<T>>): yup.MixedSchema<T>')
                .withBlock([
                (0, visitor_plugin_common_1.indent)('return yup.mixed<T>().test({'),
                (0, visitor_plugin_common_1.indent)('test: (value) => schemas.some((schema) => schema.isValidSync(value))', 2),
                (0, visitor_plugin_common_1.indent)('})'),
            ].join('\n')).string);
    }
    get InputObjectTypeDefinition() {
        return {
            leave: (node) => {
                var _a;
                const visitor = this.createVisitor('input');
                const name = visitor.convertName(node.name.value);
                this.importTypes.push(name);
                return this.buildInputFields((_a = node.fields) !== null && _a !== void 0 ? _a : [], visitor, name);
            },
        };
    }
    get ObjectTypeDefinition() {
        return {
            leave: (0, graphql_1.ObjectTypeDefinitionBuilder)(this.config.withObjectType, (node) => {
                var _a;
                const visitor = this.createVisitor('output');
                const name = visitor.convertName(node.name.value);
                this.importTypes.push(name);
                // Building schema for field arguments.
                const argumentBlocks = this.buildObjectTypeDefinitionArguments(node, visitor);
                const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';
                // Building schema for fields.
                const shape = (_a = node.fields) === null || _a === void 0 ? void 0 : _a.map(field => {
                    const fieldSchema = generateFieldYupSchema(this.config, visitor, field, 2);
                    return (0, graphql_1.isNonNullType)(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
                }).join(',\n');
                switch (this.config.validationSchemaExportType) {
                    case 'const':
                        return (new visitor_plugin_common_1.DeclarationBlock({})
                            .export()
                            .asKind('const')
                            .withName(`${name}Schema: yup.ObjectSchema<${name}>`)
                            .withContent([
                            `yup.object({`,
                            (0, visitor_plugin_common_1.indent)(`__typename: yup.string<'${node.name.value}'>().optional(),`, 2),
                            shape,
                            '}).strict()',
                        ].join('\n')).string + appendArguments);
                    case 'function':
                    default:
                        return (new visitor_plugin_common_1.DeclarationBlock({})
                            .export()
                            .asKind('function')
                            .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
                            .withBlock([
                            (0, visitor_plugin_common_1.indent)(`return yup.object({`),
                            (0, visitor_plugin_common_1.indent)(`__typename: yup.string<'${node.name.value}'>().optional(),`, 2),
                            shape,
                            (0, visitor_plugin_common_1.indent)('}).strict()'),
                        ].join('\n')).string + appendArguments);
                }
            }),
        };
    }
    get EnumTypeDefinition() {
        return {
            leave: (node) => {
                var _a, _b;
                const visitor = this.createVisitor('both');
                const enumname = visitor.convertName(node.name.value);
                this.importTypes.push(enumname);
                // hoise enum declarations
                if (this.config.enumsAsTypes) {
                    const enums = (_a = node.values) === null || _a === void 0 ? void 0 : _a.map(enumOption => `'${enumOption.name.value}'`);
                    this.enumDeclarations.push(new visitor_plugin_common_1.DeclarationBlock({})
                        .export()
                        .asKind('const')
                        .withName(`${enumname}Schema`)
                        .withContent(`yup.string().oneOf([${enums === null || enums === void 0 ? void 0 : enums.join(', ')}])`).string);
                }
                else {
                    const values = (_b = node.values) === null || _b === void 0 ? void 0 : _b.map(enumOption => `${enumname}.${visitor.convertName(enumOption.name, {
                        useTypesPrefix: false,
                        transformUnderscore: true,
                    })}`).join(', ');
                    this.enumDeclarations.push(new visitor_plugin_common_1.DeclarationBlock({})
                        .export()
                        .asKind('const')
                        .withName(`${enumname}Schema`)
                        .withContent(`yup.string<${enumname}>().oneOf([${values}])`).string);
                }
            },
        };
    }
    get UnionTypeDefinition() {
        return {
            leave: (node) => {
                var _a;
                if (!node.types || !this.config.withObjectType)
                    return;
                const visitor = this.createVisitor('output');
                const unionName = visitor.convertName(node.name.value);
                this.importTypes.push(unionName);
                const unionElements = (_a = node.types) === null || _a === void 0 ? void 0 : _a.map(t => {
                    var _a;
                    const element = visitor.convertName(t.name.value);
                    const typ = visitor.getType(t.name.value);
                    if (((_a = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _a === void 0 ? void 0 : _a.kind) === 'EnumTypeDefinition') {
                        return `${element}Schema`;
                    }
                    switch (this.config.validationSchemaExportType) {
                        case 'const':
                            return `${element}Schema`;
                        case 'function':
                        default:
                            return `${element}Schema()`;
                    }
                }).join(', ');
                switch (this.config.validationSchemaExportType) {
                    case 'const':
                        return new visitor_plugin_common_1.DeclarationBlock({})
                            .export()
                            .asKind('const')
                            .withName(`${unionName}Schema: yup.MixedSchema<${unionName}>`)
                            .withContent(`union<${unionName}>(${unionElements})`).string;
                    case 'function':
                    default:
                        return new visitor_plugin_common_1.DeclarationBlock({})
                            .export()
                            .asKind('function')
                            .withName(`${unionName}Schema(): yup.MixedSchema<${unionName}>`)
                            .withBlock((0, visitor_plugin_common_1.indent)(`return union<${unionName}>(${unionElements})`)).string;
                }
            },
        };
    }
    buildInputFields(fields, visitor, name) {
        const shape = fields === null || fields === void 0 ? void 0 : fields.map(field => {
            const fieldSchema = generateFieldYupSchema(this.config, visitor, field, 2);
            return (0, graphql_1.isNonNullType)(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
        }).join(',\n');
        switch (this.config.validationSchemaExportType) {
            case 'const':
                return new visitor_plugin_common_1.DeclarationBlock({})
                    .export()
                    .asKind('const')
                    .withName(`${name}Schema: yup.ObjectSchema<${name}>`)
                    .withContent(['yup.object({', shape, '}).strict()'].join('\n')).string;
            case 'function':
            default:
                return new visitor_plugin_common_1.DeclarationBlock({})
                    .export()
                    .asKind('function')
                    .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
                    .withBlock([(0, visitor_plugin_common_1.indent)(`return yup.object({`), shape, (0, visitor_plugin_common_1.indent)('}).strict()')].join('\n')).string;
        }
    }
}
exports.YupSchemaVisitor = YupSchemaVisitor;
const generateFieldYupSchema = (config, visitor, field, indentCount) => {
    var _a, _b, _c;
    const generatedCodesForDirectives = (0, directive_1.buildApi)(field.name.value, (_a = config.rules) !== null && _a !== void 0 ? _a : {}, (_b = config.ignoreRules) !== null && _b !== void 0 ? _b : [], (_c = field.directives) !== null && _c !== void 0 ? _c : []);
    const gen = generateFieldTypeYupSchema(config, visitor, field.type, null, generatedCodesForDirectives);
    return (0, visitor_plugin_common_1.indent)(`${field.name.value}: ${maybeLazy(config, field.type, gen)}`, indentCount);
};
const generateFieldTypeYupSchema = (config, visitor, type, parentType, generatedCodesForDirectives) => {
    var _a;
    if ((0, graphql_1.isListType)(type)) {
        const gen = generateFieldTypeYupSchema(config, visitor, type.type, type, generatedCodesForDirectives);
        const nullable = !parentType || !(0, graphql_1.isNonNullType)(parentType);
        return `yup.array(${maybeLazy(config, type.type, gen)})${generatedCodesForDirectives.rulesForArray}${nullable ? '.nullable()' : ''}`;
    }
    if ((0, graphql_1.isNonNullType)(type)) {
        const gen = generateFieldTypeYupSchema(config, visitor, type.type, type, generatedCodesForDirectives);
        return maybeLazy(config, type.type, gen);
    }
    if ((0, graphql_1.isNamedType)(type)) {
        const gen = generateNameNodeYupSchema(config, visitor, type.name) + generatedCodesForDirectives.rules;
        if (!!parentType && (0, graphql_1.isNonNullType)(parentType)) {
            if (visitor.shouldEmitAsNotAllowEmptyString(type.name.value)) {
                return `${gen}.defined().required()`;
            }
            return `${gen}.defined().nonNullable()`;
        }
        const typ = visitor.getType(type.name.value);
        if (((_a = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _a === void 0 ? void 0 : _a.kind) === 'InputObjectTypeDefinition') {
            return `${gen}`;
        }
        return `${gen}.nullable()`;
    }
    console.warn('unhandled type:', type);
    return '';
};
const generateNameNodeYupSchema = (config, visitor, node) => {
    const converter = visitor.getNameNodeConverter(node);
    switch (converter === null || converter === void 0 ? void 0 : converter.targetKind) {
        case 'InputObjectTypeDefinition':
        case 'ObjectTypeDefinition':
        case 'UnionTypeDefinition':
            // using switch-case rather than if-else to allow for future expansion
            switch (config.validationSchemaExportType) {
                case 'const':
                    return `${converter.convertName()}Schema`;
                case 'function':
                default:
                    return `${converter.convertName()}Schema()`;
            }
        case 'EnumTypeDefinition':
            return `${converter.convertName()}Schema`;
        default:
            return yup4Scalar(config, visitor, node.value);
    }
};
const maybeLazy = (config, type, schema) => {
    var _a;
    if ((0, graphql_1.isNamedType)(type) && (0, graphql_1.isInput)(type.name.value) && ((_a = config.lazyTypes) === null || _a === void 0 ? void 0 : _a.includes(type.name.value))) {
        // https://github.com/jquense/yup/issues/1283#issuecomment-786559444
        return `yup.lazy(() => ${schema})`;
    }
    return schema;
};
const yup4Scalar = (config, visitor, scalarName) => {
    var _a;
    if ((_a = config.scalarSchemas) === null || _a === void 0 ? void 0 : _a[scalarName]) {
        return `${config.scalarSchemas[scalarName]}`;
    }
    const tsType = visitor.getScalarType(scalarName);
    switch (tsType) {
        case 'string':
            return `yup.string()`;
        case 'number':
            return `yup.number()`;
        case 'boolean':
            return `yup.boolean()`;
    }
    console.warn('unhandled name:', scalarName);
    return `yup.mixed()`;
};
