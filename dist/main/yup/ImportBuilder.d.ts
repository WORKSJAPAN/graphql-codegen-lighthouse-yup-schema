export declare class ImportBuilder {
    private readonly importFrom;
    private readonly useTypeImports;
    constructor(importFrom: string | undefined, useTypeImports: boolean | undefined);
    build(types: readonly string[]): string[];
}
