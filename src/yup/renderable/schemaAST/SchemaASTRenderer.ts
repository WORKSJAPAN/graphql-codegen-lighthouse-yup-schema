import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { NameNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../../config';
import { isSpecifiedScalarName } from '../../../graphql';
import { Visitor } from '../../../visitor';
import { RuleASTRenderer } from '../ruleAST/RuleASTRenderer';
import { ExportTypeStrategy } from './../../exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from './../../renderable/field/FieldMetadata';
import { SchemaASTLazyNode } from './../../renderable/schemaAST/SchemaASTLazyNode';
import { SchemaASTListNode } from './../../renderable/schemaAST/SchemaASTListNode';
import { SchemaASTNamedTypeNode } from './../../renderable/schemaAST/SchemaASTNamedTypeNode';
import { ScalarRenderer } from './../../ScalarRenderer';

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
    const { namedTypeNode, isNonNull, isDefined } = namedType.getData();
    const gen =
      this.generateNameNodeYupSchema(namedTypeNode.name) + fieldMetadata.getData().rule.render(this.ruleASTRenderer);
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

  public generateNameNodeYupSchema(node: NameNode): string {
    const converter = this.getNameNodeConverter(node);

    switch (converter?.targetKind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return this.exportTypeStrategy.schemaEvaluation(`${converter.convertName()}Schema`, converter?.targetKind);
      default:
        return this.scalarRenderer.render(node.value, this.scalarDirection);
    }
  }

  private getNameNodeConverter(node: NameNode) {
    const typ = this.visitor.getType(node.value);
    const astNode = typ?.astNode;
    if (astNode === undefined || astNode === null) {
      return undefined;
    }
    return {
      targetKind: astNode.kind,
      convertName: () => this.visitor.convertName(astNode.name.value),
    };
  }

  public shouldEmitAsNotAllowEmptyString(name: string): boolean {
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
