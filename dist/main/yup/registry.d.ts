export declare class Registry {
    private readonly types;
    private readonly enumDeclarations;
    registerType(type: string): void;
    registerEnumDeclaration(enumDeclaration: string): void;
    getTypes(): readonly string[];
    getEnumDeclarations(): readonly string[];
}
