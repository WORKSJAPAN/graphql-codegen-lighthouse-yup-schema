import { DeclarationBlock } from '@graphql-codegen/visitor-plugin-common';
import { EnumValueDefinitionNode } from 'graphql/language';

import { EnumDeclarationStrategy } from './EnumDeclarationStrategy';

export class AsTypeEnumDeclarationStrategy implements EnumDeclarationStrategy {
  enumDeclaration(enumName: string, enumOptions: readonly EnumValueDefinitionNode[]): string {
    const enums = enumOptions.map(enumOption => `'${enumOption.name.value}'`);

    return new DeclarationBlock({})
      .export()
      .asKind('const')
      .withName(`${enumName}Schema`)
      .withContent(`yup.string().oneOf([${enums.join(', ')}])`).string;
  }
}
