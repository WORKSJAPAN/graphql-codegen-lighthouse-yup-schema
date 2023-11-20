import { Kind } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../../config';
import { isSpecifiedScalarName } from '../../../graphql';
import { ExportTypeStrategy } from '../../exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from '../field/FieldMetadata';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNamedTypeNode2 } from './SchemaASTNamedTypeNode2';

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

  public renderNamedType2(namedType: SchemaASTNamedTypeNode2, fieldMetadata: FieldMetadata): string {
    const { kind, isNonNull, isDefined } = namedType.getData();
    const gen = this.generateNameNodeYupSchema(namedType) + fieldMetadata.getData().rule.render(this.ruleASTRenderer);
    if (isNonNull) {
      const ret = this.shouldEmitAsNotAllowEmptyString(namedType)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }

    // オブジェクトを入力する場合はnullable()をつけない (undefined なことはある)
    if (kind === Kind.INPUT_OBJECT_TYPE_DEFINITION) {
      const ret = `${gen}`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }
    const ret = `${gen}.nullable()`;
    return isDefined ? `${ret}.defined()` : `${ret}`;
  }

  private generateNameNodeYupSchema(schemaASTNamedTypeNode2: SchemaASTNamedTypeNode2): string {
    const { kind, convertedName } = schemaASTNamedTypeNode2.getData();
    switch (kind) {
      case Kind.INPUT_OBJECT_TYPE_DEFINITION:
      case Kind.OBJECT_TYPE_DEFINITION:
      case Kind.UNION_TYPE_DEFINITION:
      case Kind.ENUM_TYPE_DEFINITION:
        return this.exportTypeStrategy.schemaEvaluation(`${convertedName}Schema`, kind);
      case Kind.SCALAR_TYPE_DEFINITION:
      case null:
        return this.renderScalar(schemaASTNamedTypeNode2);
      default:
        return assertsNeverKind(kind);
    }
  }

  private shouldEmitAsNotAllowEmptyString(schemaASTNamedTypeNode2: SchemaASTNamedTypeNode2): boolean {
    if (this.config.notAllowEmptyString !== true) {
      return false;
    }

    const { kind, graphQLTypeName, tsTypeName } = schemaASTNamedTypeNode2.getData();
    if (kind !== 'ScalarTypeDefinition' && !isSpecifiedScalarName(graphQLTypeName)) {
      return false;
    }

    return tsTypeName === 'string';
  }

  private renderScalar(schemaASTNamedTypeNode2: SchemaASTNamedTypeNode2): string {
    const { graphQLTypeName, tsTypeName } = schemaASTNamedTypeNode2.getData();
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

function assertsNeverKind(kind: never): never {
  throw new Error(`unexpected kind: ${kind}`);
}
