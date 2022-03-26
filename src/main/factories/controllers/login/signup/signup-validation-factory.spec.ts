import { IEmailValidator } from '@validation/protocols/email-validator';
import { mockEmailValidator } from '@validation/test/mock-email-validator';
import {
  IValidation,
  RequiredFieldValidation,
  CompareFieldsValidation,
  EmailValidation,
  ValidationComposite,
} from '@validation/validators';

import { makeSignupValidation } from './signup-validation-factory';

jest.mock('@validation/validators/validation-composite');

describe('SignupValidation factory', () => {
  test('Should call validation composite with all validations', () => {
    makeSignupValidation();
    const validations: IValidation[] = [];

    for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(
      new CompareFieldsValidation('password', 'passwordConfirmation')
    );

    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
