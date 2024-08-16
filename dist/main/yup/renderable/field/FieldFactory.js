"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FieldFactory = void 0;
const graphql_1 = require("../../../graphql");
const Field_1 = require("./Field");
const FieldMetadata_1 = require("./FieldMetadata");
class FieldFactory {
    constructor(typeASTFactory, ruleASTFactory) {
        this.typeASTFactory = typeASTFactory;
        this.ruleASTFactory = ruleASTFactory;
    }
    create(graphQLFieldNode) {
        var _a;
        const directives = (_a = graphQLFieldNode.directives) !== null && _a !== void 0 ? _a : [];
        const rulesDirective = findDirectiveByName(directives, 'rules');
        const rulesForArrayDirective = findDirectiveByName(directives, 'rulesForArray');
        const metadata = new FieldMetadata_1.FieldMetadata({
            name: graphQLFieldNode.name.value,
            label: graphQLFieldNode.description
                ? graphQLFieldNode.description.block
                    ? graphQLFieldNode.description.value.split('\n')[0]
                    : graphQLFieldNode.description.value
                : null,
            isOptional: !(0, graphql_1.isNonNullType)(graphQLFieldNode.type),
            rule: this.ruleASTFactory.createFromDirectiveOrNull(rulesDirective !== null && rulesDirective !== void 0 ? rulesDirective : null),
            ruleForArray: this.ruleASTFactory.createFromDirectiveOrNull(rulesForArrayDirective !== null && rulesForArrayDirective !== void 0 ? rulesForArrayDirective : null),
        });
        return new Field_1.Field(metadata, this.typeASTFactory.create(graphQLFieldNode.type));
    }
}
exports.FieldFactory = FieldFactory;
const supportedDirectiveNames = ['rules', 'rulesForArray'];
const findDirectiveByName = (directives, name) => {
    return directives.find(directive => directive.name.value === name);
};
