import { ObjectTypeDefinitionNode } from 'graphql';

export interface WithObjectTypesSpec {
  shouldBeUsed(node: ObjectTypeDefinitionNode): boolean;
}
