import { NormalRule } from './NormalRule';
import { SometimesRule } from './SometimesRule';

export class RuleRenderer {
  public renderNormalRule(normalRule: NormalRule): string {
    const { name, args } = normalRule.getData();
    return `.${name}(${args.map(codifyArgument).join(',')})`;
  }

  public renderSometimesRule(sometimesRule: SometimesRule): string {
    const { fieldName, children } = sometimesRule.getData();
    const childrenSchema = children.map(child => child.render(this));

    return `.sometimes(${JSON.stringify(fieldName)}, schema => schema${childrenSchema})`;
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
