import { WithObjectTypesSpec } from './withObjectTypesSpecs/WithObjectTypesSpec';
export declare class InitialEmitter {
    private readonly withObjectTypesSpec;
    constructor(withObjectTypesSpec: WithObjectTypesSpec);
    emit(enumDeclarations: readonly string[]): string;
    private unionFunctionDeclaration;
}
