import { InvalidParamError } from '../../presentations/errors/invalidParamError';
import { IValidation } from './index';

export class CompareFieldsValidation implements IValidation {
  constructor(
    private readonly fieldName: string,
    private readonly fieldToCompareName: string
  ) {}
  validate(input: any): Error {
    if (input[this.fieldName] !== input[this.fieldToCompareName]) {
      return new InvalidParamError(this.fieldToCompareName);
    }
    return null;
  }
}
