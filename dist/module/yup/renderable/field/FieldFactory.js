import { isNonNullType } from '../../../graphql';
import { Field } from './Field';
import { FieldMetadata } from './FieldMetadata';
export class FieldFactory {
    typeASTFactory;
    ruleASTFactory;
    constructor(typeASTFactory, ruleASTFactory) {
        this.typeASTFactory = typeASTFactory;
        this.ruleASTFactory = ruleASTFactory;
    }
    create(graphQLFieldNode) {
        const directives = graphQLFieldNode.directives ?? [];
        const rulesDirective = findDirectiveByName(directives, 'rules');
        const rulesForArrayDirective = findDirectiveByName(directives, 'rulesForArray');
        const fieldName = graphQLFieldNode.name.value;
        const metadata = new FieldMetadata({
            name: graphQLFieldNode.name.value,
            isOptional: !isNonNullType(graphQLFieldNode.type),
            rule: this.ruleASTFactory.createFromDirectiveOrNull(fieldName, rulesDirective ?? null),
            ruleForArray: this.ruleASTFactory.createFromDirectiveOrNull(fieldName, rulesForArrayDirective ?? null),
        });
        return new Field(metadata, this.typeASTFactory.create(graphQLFieldNode.type));
    }
}
const supportedDirectiveNames = ['rules', 'rulesForArray'];
const findDirectiveByName = (directives, name) => {
    return directives.find(directive => directive.name.value === name);
};
