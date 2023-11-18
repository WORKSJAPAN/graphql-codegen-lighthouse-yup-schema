import { GraphQLSchema } from 'graphql';

import { ValidationSchemaPluginConfig } from './config';
import { Visitor } from './visitor';

export class VisitorFactory {
  public constructor(
    private schema: GraphQLSchema,
    private config: ValidationSchemaPluginConfig
  ) {}

  public createVisitor(scalarDirection: 'input' | 'output' | 'both'): Visitor {
    return new Visitor(scalarDirection, this.schema, this.config);
  }
}
