import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { RuleASTFactory } from '../ruleAST/RuleASTFactory';
import { TypeASTFactory } from '../typeAST/TypeASTFactory';
import { Field } from './Field';
export declare class FieldFactory {
    private readonly typeASTFactory;
    private readonly ruleASTFactory;
    constructor(typeASTFactory: TypeASTFactory, ruleASTFactory: RuleASTFactory);
    create(graphQLFieldNode: InputValueDefinitionNode | FieldDefinitionNode): Field;
}
