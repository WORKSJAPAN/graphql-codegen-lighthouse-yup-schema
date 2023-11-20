import { CompositeRule } from './CompositeRule';
import { SingleRule } from './SingleRule';
import { SometimesRule } from './SometimesRule';

export class RuleRenderer {
  public renderSingleRule(singleRule: SingleRule): string {
    const { mappedName, rawArgs } = singleRule.getData();
    return `.${mappedName}(${rawArgs.map(codifyArgument).join(',')})`;
  }

  public renderCompositeRule(compositeRule: CompositeRule): string {
    return compositeRule
      .getData()
      .children.map(child => child.render(this))
      .join('');
  }

  public renderSometimesRule(sometimesRule: SometimesRule): string {
    const { fieldName, continuation } = sometimesRule.getData();
    return `.sometimes(${JSON.stringify(fieldName)}, schema => schema${continuation.render(this)})`;
  }
}

const isNumber = (rawArg: string): boolean => parseFloat(rawArg).toString() === rawArg;
const isBoolean = (rawArg: string): boolean => rawArg.toLowerCase() === 'true' || rawArg.toLowerCase() === 'false';
const isRegex = (rawArg: string): boolean => rawArg.startsWith('/');

const codifyArgument = (rawArg: string): string => {
  if (isNumber(rawArg) || isBoolean(rawArg) || isRegex(rawArg)) {
    return rawArg;
  }
  // here, rawArg seems to be string
  return JSON.stringify(rawArg);
};
