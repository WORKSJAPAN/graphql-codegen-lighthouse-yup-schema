import { Kind } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../../config';
import { isSpecifiedScalarName } from '../../../graphql';
import { ExportTypeStrategy } from '../../exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from '../field/FieldMetadata';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';

export class SchemaASTRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly ruleASTRenderer: RuleASTRenderer,
    private readonly exportTypeStrategy: ExportTypeStrategy
  ) {}

  public renderLazy(lazy: SchemaASTLazyNode, fieldMetadata: FieldMetadata): string {
    const { child } = lazy.getData();
    return `yup.lazy(() => ${child.render(this, fieldMetadata)})`;
  }

  public renderList(list: SchemaASTListNode, fieldMetadata: FieldMetadata): string {
    const { child, isNonNull, isDefined } = list.getData();
    const rendered = child.render(this, fieldMetadata);

    return `yup.array(${rendered})${fieldMetadata.getData().ruleForArray.render(this.ruleASTRenderer)}${
      isNonNull ? '.defined()' : '.nullable()'
    }${isDefined ? '.defined()' : ''}`;
  }

  public renderNamedType(namedType: SchemaASTNamedTypeNode, fieldMetadata: FieldMetadata): string {
    const { graphQLTypeName, kind, tsTypeName, isNonNull, isDefined } = namedType.getData();
    const gen = this.generateNameNodeYupSchema(namedType) + fieldMetadata.getData().rule.render(this.ruleASTRenderer);
    if (isNonNull) {
      const ret = this.shouldEmitAsNotAllowEmptyString(graphQLTypeName, kind, tsTypeName)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }

    // オブジェクトを入力する場合はnullable()をつけない (undefined なことはある)
    if (kind === 'InputObjectTypeDefinition') {
      const ret = `${gen}`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }
    const ret = `${gen}.nullable()`;
    return isDefined ? `${ret}.defined()` : `${ret}`;
  }

  private generateNameNodeYupSchema(schemaASTNamedTypeNode: SchemaASTNamedTypeNode): string {
    const { kind, convertedName } = schemaASTNamedTypeNode.getData();
    switch (kind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return this.exportTypeStrategy.schemaEvaluation(`${convertedName}Schema`, kind);
      default:
        return this.renderScalar(schemaASTNamedTypeNode);
    }
  }

  private shouldEmitAsNotAllowEmptyString(name: string, kind: Kind | null, tsType: string | null): boolean {
    if (this.config.notAllowEmptyString !== true) {
      return false;
    }
    if (kind !== 'ScalarTypeDefinition' && !isSpecifiedScalarName(name)) {
      return false;
    }

    return tsType === 'string';
  }

  private renderScalar(schemaASTNamedTypeNode: SchemaASTNamedTypeNode): string {
    const { graphQLTypeName, tsTypeName } = schemaASTNamedTypeNode.getData();
    const scalarSchemas = this.config.scalarSchemas || {};

    if (scalarSchemas[graphQLTypeName]) {
      return `${scalarSchemas[graphQLTypeName]}`;
    }
    switch (tsTypeName) {
      case 'string':
        return `yup.string()`;
      case 'number':
        return `yup.number()`;
      case 'boolean':
        return `yup.boolean()`;
    }
    console.warn('unhandled name:', graphQLTypeName);
    return `yup.mixed()`;
  }
}
