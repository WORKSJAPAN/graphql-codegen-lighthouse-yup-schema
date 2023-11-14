import { Rules } from './config';
import { TsValidationMethodCall } from './TsValidationMethodCall';
export declare class TsValidationMethodCallMapper {
    private rules;
    private ignoreRules;
    constructor(rules: Rules, ignoreRules: readonly string[]);
    create(ruleString: string): TsValidationMethodCall | null;
    private mapMethodName;
}
