"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TsValidationMethodCall = void 0;
class TsValidationMethodCall {
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
exports.TsValidationMethodCall = TsValidationMethodCall;
