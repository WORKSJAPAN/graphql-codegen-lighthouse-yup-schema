export class ImportBuilder {
    importFrom;
    useTypeImports;
    constructor(importFrom, useTypeImports) {
        this.importFrom = importFrom;
        this.useTypeImports = useTypeImports;
    }
    build(types) {
        if (!this.importFrom || types.length === 0)
            return [IMPORT_STATEMENT_YUP];
        return [
            IMPORT_STATEMENT_YUP,
            `import ${this.useTypeImports ? 'type ' : ''}{ ${types.join(', ')} } from '${this.importFrom}'`,
        ];
    }
}
const IMPORT_STATEMENT_YUP = `import * as yup from 'yup'`;
