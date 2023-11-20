import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { NameNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { isSpecifiedScalarName } from '../graphql';
import { Visitor } from '../visitor';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { FieldMetadata } from './renderable/FieldMetadata';
import { Lazy } from './renderable/Lazy';
import { ListType } from './renderable/ListType';
import { ScalarRenderer } from './ScalarRenderer';

export class FieldRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly visitor: Visitor,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly scalarRenderer: ScalarRenderer,
    private readonly scalarDirection: keyof NormalizedScalarsMap[string]
  ) {}

  public renderLazy(lazy: Lazy, fieldMetadata: FieldMetadata): string {
    return `yup.lazy(() => ${lazy.getChild().render(this, fieldMetadata)})`;
  }

  public renderList(list: ListType, fieldMetadata: FieldMetadata): string {
    const rendered = list.getChild().render(this, fieldMetadata);

    return `yup.array(${rendered})${fieldMetadata.getGeneratedCodesForDirectives().rulesForArray}${
      list.isNonNull() ? '.defined()' : '.nullable()'
    }${list.isDefined() ? '.defined()' : ''}`;
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

  public getVisitor() {
    return this.visitor;
  }
}
