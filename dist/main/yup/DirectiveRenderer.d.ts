import { ConstDirectiveNode } from 'graphql';
import { Rules } from '../config';
export declare class DirectiveRenderer {
    readonly rules: Rules;
    readonly ignoreRules: readonly string[];
    constructor(rules?: Rules, ignoreRules?: readonly string[]);
    render(fieldName: string, directives: readonly ConstDirectiveNode[]): GeneratedCodesForDirectives;
    private buildApiFromDirectiveArguments;
    /**
     * sometimes は超特殊で、他の検証ルールを無視する必要があるため、コールバックで他の検証ルールを渡す形にする。
     */
    private buildApiSchema;
}
/**
 * GraphQL schema
 * ```graphql
 * input ExampleInput {
 *   email: String! @rules(apply: ["minLength:100", "email"])
 * }
 */
declare const supportedDirectiveNames: readonly ["rules", "rulesForArray"];
type SupportedDirectiveName = (typeof supportedDirectiveNames)[number];
export type GeneratedCodesForDirectives = Record<SupportedDirectiveName, string>;
export {};
