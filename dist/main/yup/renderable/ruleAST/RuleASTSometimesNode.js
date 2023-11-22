"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleASTSometimesNode = void 0;
// sometimes は特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
class RuleASTSometimesNode {
    constructor(fieldName, // 消したい
    continuation, _requiresLazy) {
        this.fieldName = fieldName;
        this.continuation = continuation;
        this._requiresLazy = _requiresLazy;
    }
    getData() {
        return {
            fieldName: this.fieldName,
            continuation: this.continuation,
        };
    }
    render(ruleRenderer) {
        return ruleRenderer.renderSometimesRule(this);
    }
    requiresLazy() {
        return this._requiresLazy || this.continuation.requiresLazy();
    }
}
exports.RuleASTSometimesNode = RuleASTSometimesNode;
