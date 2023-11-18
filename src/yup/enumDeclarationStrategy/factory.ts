import { TsVisitor } from '@graphql-codegen/typescript';

import { AsConstEnumDeclarationStrategy } from './AsConstEnumDeclarationStrategy';
import { AsTypeEnumDeclarationStrategy } from './AsTypeEnumDeclarationStrategy';
import { EnumDeclarationStrategy } from './EnumDeclarationStrategy';

export const createEnumExportStrategy = (
  enumsAsType: boolean | undefined,
  visitor: TsVisitor
): EnumDeclarationStrategy => {
  return enumsAsType ? new AsTypeEnumDeclarationStrategy() : new AsConstEnumDeclarationStrategy(visitor);
};
