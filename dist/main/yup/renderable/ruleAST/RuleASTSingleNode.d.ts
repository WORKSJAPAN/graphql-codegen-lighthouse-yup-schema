import { RuleASTNode } from './RuleASTNode';
import { RuleASTRenderer } from './RuleASTRenderer';
export declare class RuleASTSingleNode implements RuleASTNode {
    private readonly mappedName;
    private readonly rawArgs;
    private readonly _requiresLazy;
    constructor(mappedName: string, rawArgs: readonly string[], _requiresLazy: boolean);
    getData(): {
        mappedName: string;
        rawArgs: readonly string[];
    };
    render(ruleRenderer: RuleASTRenderer): string;
    requiresLazy(): boolean;
}
