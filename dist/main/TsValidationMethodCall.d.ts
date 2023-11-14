export declare class TsValidationMethodCall {
    private methodName;
    private codifiedArgs;
    /**
     * @param methodName
     * @param codifiedArgs そのままコードに埋め込まれるため、文字列等はJSON.stringify済であること
     */
    constructor(methodName: string, codifiedArgs: string[]);
    toString(): string;
}
