import { RuleASTNode } from '../ruleAST/RuleASTNode';
export declare class FieldMetadata {
    private readonly data;
    constructor(data: {
        name: string;
        isOptional: boolean;
        rule: RuleASTNode;
        ruleForArray: RuleASTNode;
    });
    getData(): {
        name: string;
        isOptional: boolean;
        rule: RuleASTNode;
        ruleForArray: RuleASTNode;
    };
    requiresLazy(): boolean;
}
