import { EnumValueDefinitionNode } from 'graphql/language';

export interface EnumDeclarationStrategy {
  enumDeclaration(enumName: string, enumOptions: readonly EnumValueDefinitionNode[]): string;
}
