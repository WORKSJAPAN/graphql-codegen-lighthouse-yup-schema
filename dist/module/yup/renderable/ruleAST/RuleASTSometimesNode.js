// sometimes は特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
export class RuleASTSometimesNode {
    fieldName;
    continuation;
    _requiresLazy;
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
