"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Registry = void 0;
class Registry {
    constructor() {
        this.types = [];
        this.enumDeclarations = [];
    }
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
exports.Registry = Registry;
