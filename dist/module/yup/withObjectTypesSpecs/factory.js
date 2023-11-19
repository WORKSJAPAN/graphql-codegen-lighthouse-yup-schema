import { AllWithObjectTypesSpec } from './AllWithObjectTypesSpec';
import { NoReservedWithObjectTypesSpec } from './NoReservedWithObjectTypesSpec';
import { NullWithObjectTypesSpec } from './NullWithObjectTypesSpec';
export const createWithObjectTypesSpec = (withObjectTypes) => {
    switch (withObjectTypes) {
        case 'no-reserved':
            return new NoReservedWithObjectTypesSpec();
        case 'all':
            return new AllWithObjectTypesSpec();
        default:
            return new NullWithObjectTypesSpec();
    }
};
