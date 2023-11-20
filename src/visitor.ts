import { TsVisitor } from '@graphql-codegen/typescript';
import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { GraphQLSchema } from 'graphql';

import { ValidationSchemaPluginConfig } from './config';

export class Visitor extends TsVisitor {
  constructor(
    private schema: GraphQLSchema,
    pluginConfig: ValidationSchemaPluginConfig
  ) {
    super(schema, pluginConfig);
  }

  public getKind(graphQLTypeName: string) {
    return this.schema.getType(graphQLTypeName)?.astNode?.kind ?? null;
  }

  public getTypeScriptScalarType(
    graphQLTypeName: string,
    scalarDirection: keyof NormalizedScalarsMap[string]
  ): string | null {
    return this.scalars[graphQLTypeName]?.[scalarDirection] ?? null;
  }
}
