"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleASTSingleNode = void 0;
class RuleASTSingleNode {
    constructor(mappedName, rawArgs, _requiresLazy) {
        this.mappedName = mappedName;
        this.rawArgs = rawArgs;
        this._requiresLazy = _requiresLazy;
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
    requiresLazy() {
        return this._requiresLazy;
    }
}
exports.RuleASTSingleNode = RuleASTSingleNode;
