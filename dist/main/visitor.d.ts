import { TsVisitor } from '@graphql-codegen/typescript';
import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema, Kind } from 'graphql';
import { ValidationSchemaPluginConfig } from './config';
export declare class Visitor extends TsVisitor {
    private schema;
    constructor(schema: GraphQLSchema, pluginConfig: ValidationSchemaPluginConfig);
    getKind(graphQLTypeName: string): Kind.SCALAR_TYPE_DEFINITION | Kind.OBJECT_TYPE_DEFINITION | Kind.UNION_TYPE_DEFINITION | Kind.ENUM_TYPE_DEFINITION | Kind.INPUT_OBJECT_TYPE_DEFINITION | null;
    getTypeScriptScalarType(graphQLTypeName: string, scalarDirection: keyof NormalizedScalarsMap[string]): string | null;
}
/**
 * String 等の組み込みの scalar の場合は null
 */
export type GetKindResult = ReturnType<Visitor['getKind']>;
