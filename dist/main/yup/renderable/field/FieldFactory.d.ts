import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { RuleASTFactory } from '../ruleAST/RuleASTFactory';
import { SchemaASTFactory } from '../schemaAST/SchemaASTFactory';
import { Field } from './Field';
export declare class FieldFactory {
    private readonly schemaASTFactory;
    private readonly ruleASTFactory;
    constructor(schemaASTFactory: SchemaASTFactory, ruleASTFactory: RuleASTFactory);
    create(graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode): Field;
}
