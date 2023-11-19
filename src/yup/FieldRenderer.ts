import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, NamedTypeNode, NameNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../config';
import { isInput, isSpecifiedScalarName } from '../graphql';
import { Visitor } from '../visitor';
import { DirectiveRenderer } from './DirectiveRenderer';
import { ExportTypeStrategy } from './exportTypeStrategies/ExportTypeStrategy';
import { Field } from './renderable/Field';
import { ScalarRenderer } from './ScalarRenderer';

export class FieldRenderer {
  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly visitor: Visitor,
    private readonly exportTypeStrategy: ExportTypeStrategy,
    private readonly directiveRenderer: DirectiveRenderer,
    private readonly scalarRenderer: ScalarRenderer,
    private readonly scalarDirection: keyof NormalizedScalarsMap[string]
  ) {}

  // object のトップレベルのフィールドのみ (入れ子は別の Schema 定数 or 関数となるため)
  public render(field: InputValueDefinitionNode | FieldDefinitionNode): string {
    const astField = new Field(this, this.directiveRenderer, field);

    return astField.render();
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

  public isLazy(type: NamedTypeNode): boolean {
    return isInput(type.name.value) && !!this.config.lazyTypes?.includes(type.name.value);
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
