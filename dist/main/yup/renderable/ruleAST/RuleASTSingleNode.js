"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleASTSingleNode = void 0;
class RuleASTSingleNode {
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
exports.RuleASTSingleNode = RuleASTSingleNode;
