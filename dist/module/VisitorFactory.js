import { Visitor } from './visitor';
export class VisitorFactory {
    schema;
    config;
    constructor(schema, config) {
        this.schema = schema;
        this.config = config;
    }
    createVisitor(scalarDirection) {
        return new Visitor(scalarDirection, this.schema, this.config);
    }
}
