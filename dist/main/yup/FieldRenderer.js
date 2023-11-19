"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldRenderer = void 0;
const visitor_plugin_common_1 = require("@graphql-codegen/visitor-plugin-common");
const graphql_1 = require("../graphql");
class FieldRenderer {
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
        var _a;
        const generatedCodesForDirectives = this.directiveRenderer.render(field.name.value, (_a = field.directives) !== null && _a !== void 0 ? _a : []);
        const gen = this.renderTopLevelField(field.type, generatedCodesForDirectives);
        // TODO: ここで特定のディレクティブの有無によりlazyを入れる
        return (0, visitor_plugin_common_1.indent)(`${field.name.value}: ${gen}`, indentCount);
    }
    renderTopLevelField(typeNode, generatedCodesForDirectives) {
        const { isLazy, rendered } = this.handleAllType(typeNode, generatedCodesForDirectives);
        const maybeLazy = isLazy ? this.renderLazy(rendered) : rendered;
        return (0, graphql_1.isNonNullType)(typeNode) ? maybeLazy : `${maybeLazy}.optional()`;
    }
    handleAllType(typeNode, generatedCodesForDirectives) {
        if ((0, graphql_1.isListType)(typeNode)) {
            return this.renderList(typeNode.type, false, generatedCodesForDirectives);
        }
        if ((0, graphql_1.isNonNullType)(typeNode)) {
            return this.withNonNull(typeNode.type, generatedCodesForDirectives);
        }
        if ((0, graphql_1.isNamedType)(typeNode)) {
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
        if ((0, graphql_1.isListType)(innerTypeNode)) {
            return this.renderList(innerTypeNode.type, true, generatedCodesForDirectives);
        }
        if ((0, graphql_1.isNamedType)(innerTypeNode)) {
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
        var _a;
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
        if (((_a = typ === null || typ === void 0 ? void 0 : typ.astNode) === null || _a === void 0 ? void 0 : _a.kind) === 'InputObjectTypeDefinition') {
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
        switch (converter === null || converter === void 0 ? void 0 : converter.targetKind) {
            case 'InputObjectTypeDefinition':
            case 'ObjectTypeDefinition':
            case 'UnionTypeDefinition':
            case 'EnumTypeDefinition':
                return this.exportTypeStrategy.schemaEvaluation(`${converter.convertName()}Schema`, converter === null || converter === void 0 ? void 0 : converter.targetKind);
            default:
                return this.scalarRenderer.render(node.value, this.scalarDirection);
        }
    }
    isLazy(type) {
        var _a;
        return (0, graphql_1.isInput)(type.name.value) && !!((_a = this.config.lazyTypes) === null || _a === void 0 ? void 0 : _a.includes(type.name.value));
    }
    renderLazy(schema) {
        return `yup.lazy(() => ${schema})`;
    }
}
exports.FieldRenderer = FieldRenderer;
