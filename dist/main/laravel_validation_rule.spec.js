"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const laravel_validation_rule_1 = require("./laravel_validation_rule");
(0, vitest_1.describe)('parse', () => {
    vitest_1.test.each([
        [
            'integer',
            {
                name: 'integer',
                args: [],
            },
        ],
        [
            'email:rfc',
            {
                name: 'email',
                args: ['rfc'],
            },
        ],
        [
            'between:0,255',
            {
                name: 'between',
                args: [0, 255],
            },
        ],
        [
            'in:0,1,3.14,true,false,foo,bar',
            {
                name: 'in',
                args: [0, 1, 3.14, true, false, 'foo', 'bar'],
            },
        ],
    ])('%s', (input, expected) => {
        (0, vitest_1.expect)((0, laravel_validation_rule_1.parse)(input)).toEqual(expected);
    });
});
(0, vitest_1.describe)('codify', () => {
    vitest_1.test.each([
        [
            {
                name: 'between',
                args: [0, 255],
            },
            '.between(0,255)',
        ],
        [
            {
                name: 'in',
                args: [true, false],
            },
            '.in(true,false)',
        ],
        [
            {
                name: 'in',
                args: ['foo', 'bar'],
            },
            '.in("foo","bar")',
        ],
    ])('numeric args', (input, expected) => {
        (0, vitest_1.expect)((0, laravel_validation_rule_1.codify)(input)).toBe(expected);
    });
});
