export class ImportBuilder {
  private readonly types: string[] = [];

  constructor(
    private readonly importFrom: string | undefined,
    private readonly useTypeImports: boolean | undefined
  ) {}

  registerType(type: string): void {
    if (this.types.includes(type)) return;
    this.types.push(type);
  }

  build(): string[] {
    if (!this.importFrom || this.types.length === 0) return [IMPORT_STATEMENT_YUP];

    return [
      IMPORT_STATEMENT_YUP,
      `import ${this.useTypeImports ? 'type ' : ''}{ ${this.types.join(', ')} } from '${this.importFrom}'`,
    ];
  }
}

const IMPORT_STATEMENT_YUP = `import * as yup from 'yup'`;
