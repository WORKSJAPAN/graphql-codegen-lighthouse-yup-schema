import { ConstExportTypeStrategy } from './ConstExportTypeStrategy';
import { FunctionExportTypeStrategy } from './FunctionExportTypeStrategy';
export const createExportTypeStrategy = (type = 'function') => {
    if (type === 'function') {
        return new FunctionExportTypeStrategy();
    }
    if (type === 'const') {
        return new ConstExportTypeStrategy();
    }
    return assertNever();
};
function assertNever() {
    throw new Error('undefined export type');
}
