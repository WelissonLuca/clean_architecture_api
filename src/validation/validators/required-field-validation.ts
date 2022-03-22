import { MissingParamError } from '@presentations/errors';

import { IValidation } from './index';

export class RequiredFieldValidation implements IValidation {
  constructor(private readonly fieldName: string) {}
  validate(input: any): Error {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName);
    }
    return null;
  }
}
