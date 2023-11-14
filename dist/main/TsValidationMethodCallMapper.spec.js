"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const TsValidationMethodCallMapper_1 = require("./TsValidationMethodCallMapper");
(0, vitest_1.describe)('TsValidationMethodCallMapper', () => {
    const mapper = new TsValidationMethodCallMapper_1.TsValidationMethodCallMapper({
        regex: 'matches',
    }, ['exists']);
    vitest_1.test.each([
        ['email:rfc', '.email("rfc")'],
        ['in:true,false', '.in(true,false)'],
        ['between:0,255', '.between(0,255)'],
        ['matches:/test/gi', '.matches(/test/gi)'],
        ['exists:users,id', undefined],
    ])('map %s', (rule, expected) => {
        var _a;
        (0, vitest_1.expect)((_a = mapper.create(rule)) === null || _a === void 0 ? void 0 : _a.toString()).toBe(expected);
    });
});
