import { Kind } from 'graphql';
import { ExportTypeStrategy } from './ExportTypeStrategy';
export declare class FunctionExportTypeStrategy implements ExportTypeStrategy {
    objectTypeDefinition(name: string, typeName: string, shape: string, appendArguments: string): string;
    unionTypeDefinition(unionName: string, unionElements: string): string;
    inputObjectTypeDefinition(name: string, shape: string): string;
    schemaEvaluation(schema: string, kind: Kind | null): string;
}
