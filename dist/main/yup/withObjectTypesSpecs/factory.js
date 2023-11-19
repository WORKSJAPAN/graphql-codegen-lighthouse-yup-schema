"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWithObjectTypesSpec = void 0;
const AllWithObjectTypesSpec_1 = require("./AllWithObjectTypesSpec");
const NoReservedWithObjectTypesSpec_1 = require("./NoReservedWithObjectTypesSpec");
const NullWithObjectTypesSpec_1 = require("./NullWithObjectTypesSpec");
const createWithObjectTypesSpec = (withObjectTypes) => {
    switch (withObjectTypes) {
        case 'no-reserved':
            return new NoReservedWithObjectTypesSpec_1.NoReservedWithObjectTypesSpec();
        case 'all':
            return new AllWithObjectTypesSpec_1.AllWithObjectTypesSpec();
        default:
            return new NullWithObjectTypesSpec_1.NullWithObjectTypesSpec();
    }
};
exports.createWithObjectTypesSpec = createWithObjectTypesSpec;
