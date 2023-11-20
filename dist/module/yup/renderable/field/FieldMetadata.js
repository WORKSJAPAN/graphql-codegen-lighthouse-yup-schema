export class FieldMetadata {
    name;
    isOptional;
    rule;
    ruleForArray;
    constructor(name, isOptional, rule, ruleForArray) {
        this.name = name;
        this.isOptional = isOptional;
        this.rule = rule;
        this.ruleForArray = ruleForArray;
    }
    getData() {
        return {
            name: this.name,
            isOptional: this.isOptional,
            rule: this.rule,
            ruleForArray: this.ruleForArray,
        };
    }
}
