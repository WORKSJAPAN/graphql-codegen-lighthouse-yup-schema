import { isNonNullType } from '../../../graphql';
import { Field } from './Field';
import { FieldMetadata } from './FieldMetadata';
export class FieldFactory {
    schemaASTFactory;
    ruleASTFactory;
    constructor(schemaASTFactory, ruleASTFactory) {
        this.schemaASTFactory = schemaASTFactory;
        this.ruleASTFactory = ruleASTFactory;
    }
    create(graphQLFieldNode) {
        const directives = graphQLFieldNode.directives ?? [];
        const rulesDirective = findDirectiveByName(directives, 'rules');
        const rulesForArrayDirective = findDirectiveByName(directives, 'rulesForArray');
        const fieldName = graphQLFieldNode.name.value;
        const metadata = new FieldMetadata(graphQLFieldNode.name.value, !isNonNullType(graphQLFieldNode.type), this.ruleASTFactory.createFromDirectiveOrNull(fieldName, rulesDirective ?? null), this.ruleASTFactory.createFromDirectiveOrNull(fieldName, rulesForArrayDirective ?? null));
        return new Field(metadata, this.schemaASTFactory.create(graphQLFieldNode.type));
    }
}
const supportedDirectiveNames = ['rules', 'rulesForArray'];
const findDirectiveByName = (directives, name) => {
    return directives.find(directive => directive.name.value === name);
};
