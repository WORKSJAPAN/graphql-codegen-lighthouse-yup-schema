import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql';

import { DirectiveRenderer } from '../DirectiveRenderer';
import { FieldRenderer } from '../FieldRenderer';

export class Field {
  constructor(
    private readonly fieldRenderer: FieldRenderer,
    private readonly directiveRenderer: DirectiveRenderer,
    private readonly field: InputValueDefinitionNode | FieldDefinitionNode
  ) {}

  public render() {
    const generatedCodesForDirectives = this.directiveRenderer.render(
      this.field.name.value,
      this.field.directives ?? []
    );
    const gen = this.fieldRenderer.renderTopLevelField(this.field.type, generatedCodesForDirectives);
    // TODO: ここで特定のディレクティブの有無によりlazyを入れる
    return indent(`${this.field.name.value}: ${gen}`, 2);
  }
}
