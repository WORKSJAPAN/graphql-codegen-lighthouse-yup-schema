"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.plugin = void 0;
const schema_ast_1 = require("@graphql-codegen/schema-ast");
const graphql_1 = require("graphql");
const graphql_2 = require("./graphql");
const yup_1 = require("./yup");
const plugin = (schema, _documents, config) => {
    const { schema: transformedSchema, ast } = _transformSchemaAST(schema, config);
    const visitor = new yup_1.YupSchemaVisitor(transformedSchema, config);
    const result = (0, graphql_1.visit)(ast, visitor);
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const generated = result.definitions.filter(def => typeof def === 'string');
    return {
        prepend: visitor.buildImports(),
        content: [visitor.initialEmit(), ...generated].join('\n'),
    };
};
exports.plugin = plugin;
const _transformSchemaAST = (schema, config) => {
    const { schema: _schema, ast } = (0, schema_ast_1.transformSchemaAST)(schema, config);
    // See: https://github.com/Code-Hex/graphql-codegen-typescript-validation-schema/issues/394
    const __schema = (0, graphql_2.isGeneratedByIntrospection)(_schema) ? (0, graphql_1.buildSchema)((0, graphql_1.printSchema)(_schema)) : _schema;
    // This affects the performance of code generation, so it is
    // enabled only when this option is selected.
    if (config.validationSchemaExportType === 'const') {
        return {
            schema: __schema,
            ast: (0, graphql_2.topologicalSortAST)(__schema, ast),
        };
    }
    return {
        schema: __schema,
        ast,
    };
};
