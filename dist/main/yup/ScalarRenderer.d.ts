import { NormalizedScalarsMap } from '@graphql-codegen/visitor-plugin-common';
import { Visitor } from '../visitor';
export declare class ScalarRenderer {
    private readonly scalarSchemas;
    private readonly visitor;
    constructor(scalarSchemas: Record<string, string>, visitor: Visitor);
    render(scalarName: string, scalarDirection: keyof NormalizedScalarsMap[string]): string;
}
