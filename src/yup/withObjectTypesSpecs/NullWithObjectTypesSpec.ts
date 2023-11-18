import { ObjectTypeDefinitionNode } from 'graphql';

import { WithObjectTypesSpec } from './WithObjectTypesSpec';

export class NullWithObjectTypesSpec implements WithObjectTypesSpec {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  shouldBeUsed(node: ObjectTypeDefinitionNode): boolean {
    return false;
  }
}
