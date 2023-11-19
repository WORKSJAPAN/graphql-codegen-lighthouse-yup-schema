import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';
import { ValidationSchemaPluginConfig } from '../config';
import { Visitor } from '../visitor';
import { DirectiveRenderer } from './DirectiveRenderer';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { ScalarRenderer } from './ScalarRenderer';
export declare class FieldRenderer {
    private readonly config;
    private readonly visitor;
    private readonly exportTypeStrategy;
    private readonly directiveRenderer;
    private readonly scalarRenderer;
    private readonly scalarDirection;
    constructor(config: ValidationSchemaPluginConfig, visitor: Visitor, exportTypeStrategy: ExportTypeStrategy, directiveRenderer: DirectiveRenderer, scalarRenderer: ScalarRenderer, scalarDirection: keyof NormalizedScalarsMap[string]);
    render(field: InputValueDefinitionNode | FieldDefinitionNode, indentCount: number): string;
    private renderTopLevelField;
    private handleAllType;
    private withNonNull;
    private renderList;
    private renderNamedType;
    private generateNameNodeYupSchema;
    private isLazy;
    private renderLazy;
}
