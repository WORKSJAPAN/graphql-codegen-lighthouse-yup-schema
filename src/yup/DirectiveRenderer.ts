import {
  ConstArgumentNode,
  ConstDirectiveNode,
  ConstListValueNode,
  ConstValueNode,
  Kind,
  StringValueNode,
} from 'graphql';

import { RuleFactory } from './renderable/rules/RuleFactory';
import { RuleRenderer } from './renderable/rules/RuleRenderer';

export class DirectiveRenderer {
  constructor(
    private readonly ruleFactory: RuleFactory,
    private readonly ruleRenderer: RuleRenderer
  ) {}

  public render(fieldName: string, directives: readonly ConstDirectiveNode[]): GeneratedCodesForDirectives {
    const ret: GeneratedCodesForDirectives = {
      rules: '',
      rulesForArray: '',
    };

    for (const directive of directives) {
      if (isSupportedDirective(directive.name.value)) {
        ret[directive.name.value] = this.buildApiFromDirectiveArguments(fieldName, directive.arguments ?? []);
      }
    }

    return ret;
  }

  private buildApiFromDirectiveArguments(fieldName: string, args: readonly ConstArgumentNode[]): string {
    const ruleStrings = args
      .filter(arg => arg.name.value === supportedArgumentName)
      .flatMap(({ value }) => {
        assertValueIsList(value, '`apply` argument must be a list of rules. For Example, ["integer", "max:255"].');
        return value.values.map(value => {
          assertValueIsString(value, 'rules must be a list of string. For Example, ["integer", "max:255"].');
          return value.value;
        });
      });

    const rule = this.ruleFactory.create(fieldName, ruleStrings);

    return rule.render(this.ruleRenderer);
  }
}

/**
 * GraphQL schema
 * ```graphql
 * input ExampleInput {
 *   email: String! @rules(apply: ["minLength:100", "email"])
 * }
 */
const supportedDirectiveNames = ['rules', 'rulesForArray'] as const;
type SupportedDirectiveName = (typeof supportedDirectiveNames)[number];
const supportedArgumentName = 'apply';

function isSupportedDirective(directiveName: string): directiveName is SupportedDirectiveName {
  return supportedDirectiveNames.includes(directiveName as SupportedDirectiveName);
}

export type GeneratedCodesForDirectives = Record<SupportedDirectiveName, string>;

function assertValueIsList(value: ConstValueNode, message: string): asserts value is ConstListValueNode {
  if (value.kind !== Kind.LIST) {
    throw new Error(message);
  }
}

function assertValueIsString(value: ConstValueNode, message: string): asserts value is StringValueNode {
  if (value.kind !== Kind.STRING) {
    throw new Error(message);
  }
}
