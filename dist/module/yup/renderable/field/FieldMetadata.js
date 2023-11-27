export class FieldMetadata {
    data;
    constructor(data) {
        this.data = data;
    }
    getData() {
        return {
            ...this.data,
        };
    }
    requiresLazy() {
        return this.data.rule.requiresLazy() || this.data.ruleForArray.requiresLazy();
    }
}
