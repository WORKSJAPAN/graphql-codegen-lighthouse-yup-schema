import { DeclarationBlock, indent } from '@graphql-codegen/visitor-plugin-common';
import { Kind } from 'graphql';
export class FunctionExportTypeStrategy {
    objectTypeDefinition(name, typeName, shape, appendArguments) {
        return (new DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
            .withBlock([
            indent(`return yup.object({`),
            indent(`__typename: yup.string<'${typeName}'>(),`, 2),
            shape,
            indent('}).strict()'),
        ].join('\n')).string + appendArguments);
    }
    unionTypeDefinition(unionName, unionElements) {
        return new DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${unionName}Schema(): yup.ObjectSchema<${unionName}>`)
            .withBlock(indent(`return union<${unionName}>(${unionElements})`)).string;
    }
    inputObjectTypeDefinition(name, shape) {
        return new DeclarationBlock({})
            .export()
            .asKind('function')
            .withName(`${name}Schema(): yup.ObjectSchema<${name}>`)
            .withBlock([indent(`return yup.object({`), shape, indent('}).strict()')].join('\n')).string;
    }
    schemaEvaluation(schema, kind) {
        // enum は関数出力形式でも定数として出力する
        if (kind === Kind.ENUM_TYPE_DEFINITION)
            return schema;
        return `${schema}()`;
    }
}
