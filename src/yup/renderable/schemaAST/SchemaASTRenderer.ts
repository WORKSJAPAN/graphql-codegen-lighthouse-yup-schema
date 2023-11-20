import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { Kind } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../../config';
import { isSpecifiedScalarName } from '../../../graphql';
import { Visitor } from '../../../visitor';
import { ExportTypeStrategy } from '../../exportTypeStrategies/ExportTypeStrategy';
import { ScalarRenderer } from '../../ScalarRenderer';
import { FieldMetadata } from '../field/FieldMetadata';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { SchemaASTLazyNode } from './SchemaASTLazyNode';
import { SchemaASTListNode } from './SchemaASTListNode';
import { SchemaASTNamedTypeNode } from './SchemaASTNamedTypeNode';

export class SchemaASTRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly visitor: Visitor,
    private readonly ruleASTRenderer: RuleASTRenderer,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly scalarRenderer: ScalarRenderer,
    private readonly scalarDirection: keyof NormalizedScalarsMap[string]
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
    const { namedTypeNode, name, convertedName, kind, isNonNull, isDefined } = namedType.getData();
    const gen =
      this.generateNameNodeYupSchema(name, convertedName, kind) +
      fieldMetadata.getData().rule.render(this.ruleASTRenderer);
    if (isNonNull) {
      const ret = this.shouldEmitAsNotAllowEmptyString(namedTypeNode.name.value)
        ? `${gen}.defined().required()`
        : `${gen}.defined().nonNullable()`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }

    // オブジェクトを入力する場合はnullable()をつけない (undefined なことはある)
    const typ = this.visitor.getType(namedTypeNode.name.value);
    if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
      const ret = `${gen}`;
      return isDefined ? `${ret}.defined()` : `${ret}`;
    }
    const ret = `${gen}.nullable()`;
    return isDefined ? `${ret}.defined()` : `${ret}`;
  }

  private generateNameNodeYupSchema(name: string, convertedName: string | null, targetKind: Kind | null): string {
    switch (targetKind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return this.exportTypeStrategy.schemaEvaluation(`${convertedName}Schema`, targetKind);
      default:
        return this.scalarRenderer.render(name, this.scalarDirection);
    }
  }

  private shouldEmitAsNotAllowEmptyString(name: string): boolean {
    if (this.config.notAllowEmptyString !== true) {
      return false;
    }
    const typ = this.visitor.getType(name);
    if (typ?.astNode?.kind !== 'ScalarTypeDefinition' && !isSpecifiedScalarName(name)) {
      return false;
    }
    const tsType = this.visitor.getScalarType(name, this.scalarDirection);
    return tsType === 'string';
  }
}
