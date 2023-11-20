import { RuleASTNode } from './RuleASTNode';
import { RuleASTRenderer } from './RuleASTRenderer';
export declare class RuleASTSingleNode implements RuleASTNode {
    private readonly mappedName;
    private readonly rawArgs;
    constructor(mappedName: string, rawArgs: readonly string[]);
    getData(): {
        mappedName: string;
        rawArgs: readonly string[];
    };
    render(ruleRenderer: RuleASTRenderer): string;
}
