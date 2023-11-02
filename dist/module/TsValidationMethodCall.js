export class TsValidationMethodCall {
    methodName;
    codifiedArgs;
    /**
     * @param methodName
     * @param codifiedArgs そのままコードに埋め込まれるため、文字列等はJSON.stringify済であること
     */
    constructor(methodName, codifiedArgs) {
        this.methodName = methodName;
        this.codifiedArgs = codifiedArgs;
    }
    toString() {
        return `.${this.methodName}(${this.codifiedArgs.join(',')})`;
    }
}
