"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = void 0;
const parse = (rule) => {
    const [name, rest] = rule.split(':');
    const rawArgs = rest ? rest.split(',') : [];
    return {
        name,
        rawArgs,
    };
};
exports.parse = parse;
