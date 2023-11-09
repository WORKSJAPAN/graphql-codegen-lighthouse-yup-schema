export const parse = (rule) => {
    const [name, rest] = rule.split(':');
    const rawArgs = rest ? rest.split(',') : [];
    return {
        name,
        rawArgs,
    };
};
