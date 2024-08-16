// sometimes は特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
export class RuleASTSometimesNode {
    continuation;
    _requiresLazy;
    constructor(continuation, _requiresLazy) {
        this.continuation = continuation;
        this._requiresLazy = _requiresLazy;
    }
    getData() {
        return {
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
