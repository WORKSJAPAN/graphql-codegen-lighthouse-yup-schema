import { GraphQLSchema } from 'graphql';
import { ValidationSchemaPluginConfig } from '../config';
import { Interpreter, NewVisitor } from '../types';
export declare class YupSchemaVisitor implements NewVisitor, Interpreter {
    private readonly registry;
    private readonly importBuilder;
    private readonly initialEmitter;
    private readonly inputObjectTypeDefinitionFactory;
    private readonly objectTypeDefinitionFactory;
    private readonly enumTypeDefinitionFactory;
    private readonly unionTypesDefinitionFactory;
    constructor(schema: GraphQLSchema, config: ValidationSchemaPluginConfig);
    buildImports(): string[];
    initialEmit(): string;
    get InputObjectTypeDefinition(): {
        leave: (node: import("graphql").InputObjectTypeDefinitionNode) => string;
    };
    get ObjectTypeDefinition(): {
        leave: (node: import("graphql").ObjectTypeDefinitionNode) => string | undefined;
    };
    get EnumTypeDefinition(): {
        leave: (node: import("graphql").EnumTypeDefinitionNode) => void;
    };
    get UnionTypeDefinition(): {
        leave: ((node: import("graphql").UnionTypeDefinitionNode) => string | undefined) | undefined;
    };
}
