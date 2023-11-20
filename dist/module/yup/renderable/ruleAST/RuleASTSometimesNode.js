// sometimes は特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
export class RuleASTSometimesNode {
    fieldName;
    continuation;
    constructor(fieldName, // 消したい
    continuation) {
        this.fieldName = fieldName;
        this.continuation = continuation;
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
}
