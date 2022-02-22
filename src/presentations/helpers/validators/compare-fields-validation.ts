import { InvalidParamError } from '../../errors/invalidParamError';
import { IValidation } from './validation';

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}
  validate(input: any): Error {
    if (input[this.fieldName] === input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
    return null;
  }
}
