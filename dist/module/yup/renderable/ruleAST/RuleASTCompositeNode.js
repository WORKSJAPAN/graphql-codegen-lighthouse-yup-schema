export class RuleASTCompositeNode {
    children;
    constructor(children) {
        this.children = children;
    }
    getData() {
        return {
            children: this.children,
        };
    }
    render(ruleRenderer) {
        return ruleRenderer.renderCompositeRule(this);
    }
}
