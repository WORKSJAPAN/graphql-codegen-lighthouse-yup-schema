import { ValidationSchemaPluginConfig } from '../../../config';
import { ExportTypeStrategy } from '../../exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from '../field/FieldMetadata';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { TypeASTListNode } from './TypeASTListNode';
import { TypeASTNonScalarNamedTypeNode } from './TypeASTNonScalarNamedTypeNode';
import { TypeASTNullability } from './TypeASTNullability';
import { TypeASTScalarNode } from './TypeASTScalarNode';
export declare class TypeASTRenderer {
    private readonly config;
    private readonly ruleASTRenderer;
    private readonly exportTypeStrategy;
    constructor(config: ValidationSchemaPluginConfig, ruleASTRenderer: RuleASTRenderer, exportTypeStrategy: ExportTypeStrategy);
    renderList(list: TypeASTListNode, fieldMetadata: FieldMetadata): string;
    renderNonScalarNamedType(namedType: TypeASTNonScalarNamedTypeNode, fieldMetadata: FieldMetadata): string;
    renderScalar(scalarType: TypeASTScalarNode, fieldMetadata: FieldMetadata): string;
    private doRenderScalar;
    private doRenderNonScalarNamedType;
    private renderMeta;
    renderNullability(nullability: TypeASTNullability, fieldMetadata: FieldMetadata): string;
}
