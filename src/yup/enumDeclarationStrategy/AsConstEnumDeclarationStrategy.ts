import { TsVisitor } from '@graphql-codegen/typescript';
import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
import { EnumValueDefinitionNode } from 'graphql/language';

import { EnumDeclarationStrategy } from './EnumDeclarationStrategy';

export class AsConstEnumDeclarationStrategy implements EnumDeclarationStrategy {
  constructor(private readonly visitor: TsVisitor) {}

  enumDeclaration(enumName: string, enumOptions: readonly EnumValueDefinitionNode[]): string {
    const values = enumOptions
      ?.map(
        enumOption =>
          `${enumName}.${this.visitor.convertName(enumOption.name, {
            useTypesPrefix: false,
            transformUnderscore: true,
          })}`
      )
      .join(', ');

    return new DeclarationBlock({})
      .export()
      .asKind('const')
      .withName(`${enumName}Schema`)
      .withContent(`yup.string<${enumName}>().oneOf([${values}])`).string;
  }
}
