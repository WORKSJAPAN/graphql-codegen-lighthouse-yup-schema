import { indent } from '@graphql-codegen/visitor-plugin-common';
import { isInput, isListType, isNamedType, isNonNullType } from '../graphql';
export class FieldRenderer {
    config;
    visitor;
    exportTypeStrategy;
    directiveRenderer;
    scalarRenderer;
    scalarDirection;
    constructor(config, visitor, exportTypeStrategy, directiveRenderer, scalarRenderer, scalarDirection) {
        this.config = config;
        this.visitor = visitor;
        this.exportTypeStrategy = exportTypeStrategy;
        this.directiveRenderer = directiveRenderer;
        this.scalarRenderer = scalarRenderer;
        this.scalarDirection = scalarDirection;
    }
    // object のトップレベルのフィールドのみ (入れ子は別の Schema 定数 or 関数となるため)
    render(field, indentCount) {
        const generatedCodesForDirectives = this.directiveRenderer.render(field.name.value, field.directives ?? []);
        const gen = this.renderTopLevelField(field.type, generatedCodesForDirectives);
        // TODO: ここで特定のディレクティブの有無によりlazyを入れる
        return indent(`${field.name.value}: ${gen}`, indentCount);
    }
    renderTopLevelField(typeNode, generatedCodesForDirectives) {
        const { isLazy, rendered } = this.handleAllType(typeNode, generatedCodesForDirectives);
        const maybeLazy = isLazy ? this.renderLazy(rendered) : rendered;
        return isNonNullType(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
    }
    handleAllType(typeNode, generatedCodesForDirectives) {
        if (isListType(typeNode)) {
            return this.renderList(typeNode.type, false, generatedCodesForDirectives);
        }
        if (isNonNullType(typeNode)) {
            return this.withNonNull(typeNode.type, generatedCodesForDirectives);
        }
        if (isNamedType(typeNode)) {
            return this.renderNamedType(typeNode, false, generatedCodesForDirectives);
        }
        console.warn('unhandled type:', typeNode);
        return {
            isLazy: false,
            rendered: '',
        };
    }
    // NonNull がネストすることはない
    // NonNull をどうレンダリングするかは子の型によって変わる
    withNonNull(innerTypeNode, generatedCodesForDirectives) {
        if (isListType(innerTypeNode)) {
            return this.renderList(innerTypeNode.type, true, generatedCodesForDirectives);
        }
        if (isNamedType(innerTypeNode)) {
            return this.renderNamedType(innerTypeNode, true, generatedCodesForDirectives);
        }
        console.warn('unhandled type:', innerTypeNode);
        return {
            isLazy: false,
            rendered: '',
        };
    }
    // すべてが入りうる
    renderList(innerTypeNode, isNonNull, generatedCodesForDirectives) {
        const { isLazy, rendered } = this.handleAllType(innerTypeNode, generatedCodesForDirectives);
        // NOTE: 配列の中身は必ず defined (nullが混ざることはあってもundefinedは混ざらない)
        const arrayContent = `${rendered}.defined()`;
        const maybeLazy = isLazy ? this.renderLazy(arrayContent) : arrayContent;
        return {
            isLazy: false,
            rendered: `yup.array(${maybeLazy})${generatedCodesForDirectives.rulesForArray}${isNonNull ? '.defined()' : '.nullable()'}`,
        };
    }
    // leaf. ends recursion
    renderNamedType(typeNode, isNonNull, generatedCodesForDirectives) {
        const isLazy = this.isLazy(typeNode);
        const gen = this.generateNameNodeYupSchema(typeNode.name) + generatedCodesForDirectives.rules;
        if (isNonNull) {
            const rendered = this.visitor.shouldEmitAsNotAllowEmptyString(typeNode.name.value, this.scalarDirection)
                ? `${gen}.defined().required()`
                : `${gen}.defined().nonNullable()`;
            return {
                isLazy,
                rendered,
            };
        }
        const typ = this.visitor.getType(typeNode.name.value);
        if (typ?.astNode?.kind === 'InputObjectTypeDefinition') {
            return {
                isLazy,
                rendered: `${gen}`,
            };
        }
        return {
            isLazy,
            rendered: `${gen}.nullable()`,
        };
    }
    generateNameNodeYupSchema(node) {
        const converter = this.visitor.getNameNodeConverter(node);
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
    isLazy(type) {
        return isInput(type.name.value) && !!this.config.lazyTypes?.includes(type.name.value);
    }
    renderLazy(schema) {
        return `yup.lazy(() => ${schema})`;
    }
}
