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

  public getType(name: string) {
    return this.schema.getType(name);
  }

  public getScalarType(scalarName: string, scalarDirection: keyof NormalizedScalarsMap[string]): string | null {
    return this.scalars[scalarName][scalarDirection];
  }
}
