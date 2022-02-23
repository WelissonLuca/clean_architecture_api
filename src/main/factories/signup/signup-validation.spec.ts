import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from '../../../presentations/helpers/validators';
import { IEmailValidator } from '../../../presentations/protocols/email-validator';
import { IValidation } from '../../../presentations/protocols/validation';
import { makeSignupValidation } from './signup-validation';

jest.mock('../../../presentations/helpers/validators/validation-composite');

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};

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

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
