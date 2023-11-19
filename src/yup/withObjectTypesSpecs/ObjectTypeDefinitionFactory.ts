import { indent } from '@graphql-codegen/visitor-plugin-common';
import { FieldDefinitionNode, InputValueDefinitionNode, NameNode, ObjectTypeDefinitionNode, TypeNode } from 'graphql';

import { ValidationSchemaPluginConfig } from '../../config';
import { buildApi, GeneratedCodesForDirectives } from '../../directive';
import { isInput, isListType, isNamedType, isNonNullType } from '../../graphql';
import { Visitor } from '../../visitor';
import { ExportTypeStrategy } from '../exportTypeStrategies/ExportTypeStrategy';
import { createExportTypeStrategy } from '../exportTypeStrategies/factory';
import { Registry } from '../registry';
import { ScalarRenderer } from '../ScalarRenderer';
import { VisitFunctionFactory } from '../visitFunctionFactories/types';
import { WithObjectTypesSpec } from './WithObjectTypesSpec';

export class ObjectTypeDefinitionFactory implements VisitFunctionFactory<ObjectTypeDefinitionNode> {
  private readonly scalarRenderer: ScalarRenderer;

  constructor(
    private readonly config: ValidationSchemaPluginConfig,
    private readonly registry: Registry,
    private readonly visitor: Visitor,
    private readonly withObjectTypesSpec: WithObjectTypesSpec,
    private readonly exportTypeStrategy: ExportTypeStrategy
  ) {
    this.scalarRenderer = new ScalarRenderer(config.scalarSchemas ?? {}, visitor);
  }

  create() {
    return (node: ObjectTypeDefinitionNode) => {
      if (!this.withObjectTypesSpec.shouldUseObjectTypeDefinitionNode(node)) return;

      const name = this.visitor.convertName(node.name.value);
      this.registry.registerType(name);

      // Building schema for field arguments.
      const argumentBlocks = this.visitor.buildArgumentsSchemaBlock(node, (typeName, field) => {
        this.registry.registerType(typeName);
        return this.buildInputFields(field.arguments ?? [], typeName);
      });
      const appendArguments = argumentBlocks ? '\n' + argumentBlocks : '';

      // Building schema for fields.
      const shape =
        node.fields
          ?.map(field => {
            const fieldSchema = this.generateFieldYupSchema(field, 2);
            return isNonNullType(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
          })
          .join(',\n') ?? '';

      return this.exportTypeStrategy.objectTypeDefinition(name, node.name.value, shape, appendArguments);
    };
  }

  private buildInputFields(fields: readonly (FieldDefinitionNode | InputValueDefinitionNode)[], name: string) {
    const shape = fields
      ?.map(field => {
        const fieldSchema = this.generateFieldYupSchema(field, 2);
        return isNonNullType(field.type) ? fieldSchema : `${fieldSchema}.optional()`;
      })
      .join(',\n');

    return this.exportTypeStrategy.buildInputFields(shape, name);
  }

  private generateFieldYupSchema(field: InputValueDefinitionNode | FieldDefinitionNode, indentCount: number): string {
    const generatedCodesForDirectives = buildApi(
      field.name.value,
      this.config.rules ?? {},
      this.config.ignoreRules ?? [],
      field.directives ?? []
    );
    const gen = this.generateFieldTypeYupSchema(field.type, null, generatedCodesForDirectives);
    return indent(`${field.name.value}: ${this.maybeLazy(field.type, gen)}`, indentCount);
  }

  private generateFieldTypeYupSchema(
    type: TypeNode,
    parentType: TypeNode | null,
    generatedCodesForDirectives: GeneratedCodesForDirectives
  ): string {
    if (isListType(type)) {
      const gen = this.generateFieldTypeYupSchema(type.type, type, generatedCodesForDirectives);
      const nullable = !parentType || !isNonNullType(parentType);
      // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
      return `yup.array(${this.maybeLazy(type.type, `${gen}.defined()`)})${generatedCodesForDirectives.rulesForArray}${
        nullable ? '.nullable()' : '.defined()'
      }`;
    }
    if (isNonNullType(type)) {
      const gen = this.generateFieldTypeYupSchema(type.type, type, generatedCodesForDirectives);
      return this.maybeLazy(type.type, gen);
    }
    if (isNamedType(type)) {
      const gen = this.generateNameNodeYupSchema(type.name) + generatedCodesForDirectives.rules;
      if (!!parentType && isNonNullType(parentType)) {
        if (this.visitor.shouldEmitAsNotAllowEmptyString(type.name.value)) {
          return `${gen}.defined().required()`;
        }
        return `${gen}.defined().nonNullable()`;
      }
      const typ = this.visitor.getType(type.name.value);
      if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
        return `${gen}`;
      }
      return `${gen}.nullable()`;
    }
    console.warn('unhandled type:', type);
    return '';
  }

  private generateNameNodeYupSchema(node: NameNode): string {
    const converter = this.visitor.getNameNodeConverter(node);

    switch (converter?.targetKind) {
      case 'InputObjectTypeDefinition':
      case 'ObjectTypeDefinition':
      case 'UnionTypeDefinition':
      case 'EnumTypeDefinition':
        return createExportTypeStrategy(this.config.validationSchemaExportType).schemaEvaluation(
          `${converter.convertName()}Schema`,
          converter?.targetKind
        );
      default:
        return this.scalarRenderer.render(node.value);
    }
  }

  private maybeLazy(type: TypeNode, schema: string): string {
    if (isNamedType(type) && isInput(type.name.value) && this.config.lazyTypes?.includes(type.name.value)) {
      // https://github.com/jquense/yup/issues/1283#issuecomment-786559444
      return `yup.lazy(() => ${schema})`;
    }
    return schema;
  }
}
