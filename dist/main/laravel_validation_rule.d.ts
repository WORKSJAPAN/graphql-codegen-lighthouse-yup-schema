export type ValidationMethod = {
    name: string;
    args: unknown[];
};
export declare const parse: (rule: string) => ValidationMethod;
export declare const codify: (method: ValidationMethod) => string;
