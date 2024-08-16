export class RuleASTRenderer {
    renderSingleRule(singleRule) {
        const { mappedName, rawArgs } = singleRule.getData();
        return `.${mappedName}(${rawArgs.map(codifyArgument).join(',')})`;
    }
    renderCompositeRule(compositeRule) {
        return compositeRule
            .getData()
            .children.map(child => child.render(this))
            .join('');
    }
    renderSometimesRule(sometimesRule) {
        const { continuation } = sometimesRule.getData();
        return `.sometimes(schema => schema${continuation.render(this)})`;
    }
}
const isNumber = (rawArg) => parseFloat(rawArg).toString() === rawArg;
const isBoolean = (rawArg) => rawArg.toLowerCase() === 'true' || rawArg.toLowerCase() === 'false';
const isRegex = (rawArg) => rawArg.startsWith('/');
const codifyArgument = (rawArg) => {
    if (isNumber(rawArg) || isBoolean(rawArg) || isRegex(rawArg)) {
        return rawArg;
    }
    // here, rawArg seems to be string
    return JSON.stringify(rawArg);
};
