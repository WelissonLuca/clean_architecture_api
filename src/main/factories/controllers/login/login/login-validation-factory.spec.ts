import { IEmailValidator } from '@validation/protocols/email-validator';
import { mockEmailValidator } from '@validation/test/mock-email-validator';
import {
  IValidation,
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '@validation/validators';

import { makeLoginValidation } from './login-validation-factory';

jest.mock('@validation/validators/validation-composite');

describe('SignupValidation factory', () => {
  test('Should call validation composite with all validations', () => {
    makeLoginValidation();
    const validations: IValidation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', mockEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
