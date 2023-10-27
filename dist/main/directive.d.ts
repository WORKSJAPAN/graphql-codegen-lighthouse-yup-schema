import { ConstDirectiveNode } from 'graphql';
import { Rules } from './config';
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
export declare const buildApi: (rules: Rules, ignoreRules: readonly string[], directives: readonly ConstDirectiveNode[]) => GeneratedCodesForDirectives;
export {};
