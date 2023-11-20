export class RuleASTSingleNode {
    mappedName;
    rawArgs;
    constructor(mappedName, rawArgs) {
        this.mappedName = mappedName;
        this.rawArgs = rawArgs;
    }
    getData() {
        return {
            mappedName: this.mappedName,
            rawArgs: this.rawArgs,
        };
    }
    render(ruleRenderer) {
        return ruleRenderer.renderSingleRule(this);
    }
}
