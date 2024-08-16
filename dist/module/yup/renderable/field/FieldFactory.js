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
        const metadata = new FieldMetadata({
            name: graphQLFieldNode.name.value,
            label: graphQLFieldNode.description
                ? graphQLFieldNode.description.block
                    ? graphQLFieldNode.description.value.split('\n')[0]
                    : graphQLFieldNode.description.value
                : null,
            isOptional: !isNonNullType(graphQLFieldNode.type),
            rule: this.ruleASTFactory.createFromDirectiveOrNull(rulesDirective ?? null),
            ruleForArray: this.ruleASTFactory.createFromDirectiveOrNull(rulesForArrayDirective ?? null),
        });
        return new Field(metadata, this.typeASTFactory.create(graphQLFieldNode.type));
    }
}
const supportedDirectiveNames = ['rules', 'rulesForArray'];
const findDirectiveByName = (directives, name) => {
    return directives.find(directive => directive.name.value === name);
};
