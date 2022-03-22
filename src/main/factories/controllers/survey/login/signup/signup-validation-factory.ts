import { EmailValidatorAdapter } from '@infra/validators/email-validator-adapter';
import { IValidation } from '@presentations/protocols/validation';
import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
  CompareFieldsValidation,
} from '@validation/validators';

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
