import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from '../../../presentations/helpers/validators';
import { IValidation } from '../../../presentations/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeSignupValidation = () => {
  const validations: IValidation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
