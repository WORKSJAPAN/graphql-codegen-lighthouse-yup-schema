"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RuleASTCompositeNode = void 0;
class RuleASTCompositeNode {
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
exports.RuleASTCompositeNode = RuleASTCompositeNode;
