import { RuleASTNode } from '../ruleAST/RuleASTNode';
export declare class FieldMetadata {
    private readonly name;
    private readonly isOptional;
    private readonly rule;
    private readonly ruleForArray;
    constructor(name: string, isOptional: boolean, rule: RuleASTNode, ruleForArray: RuleASTNode);
    getData(): {
        name: string;
        isOptional: boolean;
        rule: RuleASTNode;
        ruleForArray: RuleASTNode;
    };
}
