"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FunctionExportTypeStrategy = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("graphql");
class FunctionExportTypeStrategy {
    objectTypeDefinition(name, typeName, shape, appendArguments) {
        return (new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
            .withBlock([
            (0, visitor_plugin_common_1.indent)(`return yup.object({`),
            (0, visitor_plugin_common_1.indent)(`__typename: yup.string<'${typeName}'>(),`, 2),
            shape,
            (0, visitor_plugin_common_1.indent)('}).strict()'),
        ].join('\n')).string + appendArguments);
    }
    unionTypeDefinition(unionName, unionElements) {
        return new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${unionName}Schema(): yup.ObjectSchema<${unionName}>`)
            .withBlock((0, visitor_plugin_common_1.indent)(`return union<${unionName}>(${unionElements})`)).string;
    }
    inputObjectTypeDefinition(name, shape) {
        return new visitor_plugin_common_1.DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
            .withBlock([(0, visitor_plugin_common_1.indent)(`return yup.object({`), shape, (0, visitor_plugin_common_1.indent)('}).strict()')].join('\n')).string;
    }
    schemaEvaluation(schema, kind) {
        // enum は関数出力形式でも定数として出力する
        if (kind === graphql_1.Kind.ENUM_TYPE_DEFINITION)
            return schema;
        return `${schema}()`;
    }
}
exports.FunctionExportTypeStrategy = FunctionExportTypeStrategy;
