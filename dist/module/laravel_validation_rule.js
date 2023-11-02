export const parse = (rule) => {
    const [methodName, rest] = rule.split(':');
    const methodArguments = rest ? rest.split(',').map(parseArgument) : [];
    return {
        name: methodName,
        args: methodArguments,
    };
};
const parseArgument = (arg) => {
    if (parseInt(arg, 10).toString(10) === arg) {
        return parseInt(arg, 10);
    }
    if (parseFloat(arg).toString() === arg) {
        return parseFloat(arg);
    }
    if (arg.toLowerCase() === 'true') {
        return true;
    }
    if (arg.toLowerCase() === 'false') {
        return false;
    }
    return arg;
};
export const codify = (method) => {
    return `.${method.name}(${method.args.map(quoteIfNeeded).join(',')})`;
};
const quoteIfNeeded = (arg) => {
    if (typeof arg === 'string') {
        return JSON.stringify(arg);
    }
    return `${arg}`;
};
