import { ValidationSchemaPluginConfig } from '../../../config';
import { ExportTypeStrategy } from '../../exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from '../field/FieldMetadata';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNonScalarNamedTypeNode } from './SchemaASTNonScalarNamedTypeNode';
import { SchemaASTScalarNode } from './SchemaASTScalarNode';
export declare class SchemaASTRenderer {
    private readonly config;
    private readonly ruleASTRenderer;
    private readonly exportTypeStrategy;
    constructor(config: ValidationSchemaPluginConfig, ruleASTRenderer: RuleASTRenderer, exportTypeStrategy: ExportTypeStrategy);
    renderLazy(lazy: SchemaASTLazyNode, fieldMetadata: FieldMetadata): string;
    renderList(list: SchemaASTListNode, fieldMetadata: FieldMetadata): string;
    renderNonScalarNamedType(namedType: SchemaASTNonScalarNamedTypeNode, fieldMetadata: FieldMetadata): string;
    renderScalar(scalarType: SchemaASTScalarNode, fieldMetadata: FieldMetadata): string;
    private doRenderScalar;
    private doRenderNonScalarNamedType;
    private shouldEmitAsNotAllowEmptyString;
}
