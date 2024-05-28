"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstExportTypeStrategy = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
class ConstExportTypeStrategy {
    objectTypeDefinition(name, typeName, shape, appendArguments) {
        return (new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${name}Schema: yup.ObjectSchema<${name}>`)
            .withContent([`yup.object({`, (0, visitor_plugin_common_1.indent)(`__typename: yup.string<'${typeName}'>(),`, 2), shape, '}).strict()'].join('\n')).string + appendArguments);
    }
    unionTypeDefinition(unionName, unionElements) {
        return new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${unionName}Schema: yup.ObjectSchema<${unionName}>`)
            .withContent(`union<${unionName}>(${unionElements})`).string;
    }
    inputObjectTypeDefinition(name, shape) {
        return new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${name}Schema: yup.ObjectSchema<${name}>`)
            .withContent(['yup.object({', shape, '}).strict()'].join('\n')).string;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    schemaEvaluation(schema, _kind) {
        return schema;
    }
}
exports.ConstExportTypeStrategy = ConstExportTypeStrategy;
