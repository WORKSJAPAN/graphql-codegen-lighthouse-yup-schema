"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createExportTypeStrategy = void 0;
const ConstExportTypeStrategy_1 = require("./ConstExportTypeStrategy");
const FunctionExportTypeStrategy_1 = require("./FunctionExportTypeStrategy");
const createExportTypeStrategy = (type = 'function') => {
    if (type === 'function') {
        return new FunctionExportTypeStrategy_1.FunctionExportTypeStrategy();
    }
    if (type === 'const') {
        return new ConstExportTypeStrategy_1.ConstExportTypeStrategy();
    }
    return assertNever();
};
exports.createExportTypeStrategy = createExportTypeStrategy;
function assertNever() {
    throw new Error('undefined export type');
}
