import { ObjectTypeDefinitionNode } from 'graphql';
import { WithObjectTypesSpec } from './WithObjectTypesSpec';
export declare class NullWithObjectTypesSpec implements WithObjectTypesSpec {
    shouldUseObjectTypeDefinitionNode(node: ObjectTypeDefinitionNode): boolean;
    shouldIncludeUnion(): boolean;
}
