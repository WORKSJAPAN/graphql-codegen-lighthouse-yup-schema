export class Registry {
    types = [];
    enumDeclarations = [];
    registerType(type) {
        if (this.types.includes(type))
            return;
        this.types.push(type);
    }
    registerEnumDeclaration(enumDeclaration) {
        if (this.enumDeclarations.includes(enumDeclaration))
            return;
        this.enumDeclarations.push(enumDeclaration);
    }
    getTypes() {
        return this.types;
    }
    getEnumDeclarations() {
        return this.enumDeclarations;
    }
}
