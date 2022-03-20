import { IEmailValidator } from '../../../../../../validation/protocols/email-validator';
import {
  IValidation,
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../../../../validation/validators';
import { makeLoginValidation } from './login-validation-factory';

jest.mock('../../../../../../validation/validators/validation-composite');

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
    makeLoginValidation();
    const validations: IValidation[] = [];

    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }

    validations.push(new EmailValidation('email', makeEmailValidator()));

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
