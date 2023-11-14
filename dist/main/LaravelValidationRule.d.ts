export type LighthouseValidationRule = {
    name: string;
    rawArgs: string[];
};
export declare const parse: (rule: string) => LighthouseValidationRule;
