import { GeneratedCodesForDirectives } from '../DirectiveRenderer';

export class FieldMetadata {
  constructor(readonly generatedCodesForDirectives: GeneratedCodesForDirectives) {}

  public getGeneratedCodesForDirectives(): GeneratedCodesForDirectives {
    return this.generatedCodesForDirectives;
  }
}
