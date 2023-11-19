import { Kind } from 'graphql';

export interface ExportTypeStrategy {
  objectTypeDefinition(name: string, typeName: string, shape: string, appendArguments: string): string;
  unionTypeDefinition(unionName: string, unionElements: string): string;
  inputObjectTypeDefinition(shape: string, name: string): string;
  schemaEvaluation(schema: string, kind?: Kind): string;
}
