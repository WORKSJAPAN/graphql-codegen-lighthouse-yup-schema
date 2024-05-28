import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
export class ConstExportTypeStrategy {
    objectTypeDefinition(name, typeName, shape, appendArguments) {
        return (new DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${name}Schema: yup.ObjectSchema<${name}>`)
            .withContent([`yup.object({`, indent(`__typename: yup.string<'${typeName}'>(),`, 2), shape, '}).strict()'].join('\n')).string + appendArguments);
    }
    unionTypeDefinition(unionName, unionElements) {
        return new DeclarationBlock({})
            .export()
            .asKind('const')
            .withName(`${unionName}Schema: yup.ObjectSchema<${unionName}>`)
            .withContent(`union<${unionName}>(${unionElements})`).string;
    }
    inputObjectTypeDefinition(name, shape) {
        return new DeclarationBlock({})
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
