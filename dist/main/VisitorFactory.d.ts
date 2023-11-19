import { GraphQLSchema } from 'graphql';
import { ValidationSchemaPluginConfig } from './config';
import { Visitor } from './visitor';
export declare class VisitorFactory {
    private schema;
    private config;
    constructor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig);
    createVisitor(scalarDirection: 'input' | 'output' | 'both'): Visitor;
}
