import {
  RequiredFieldValidation,
  EmailValidation,
  ValidationComposite,
} from '../../../presentations/helpers/validators';
import { IValidation } from '../../../presentations/protocols/validation';
import { EmailValidatorAdapter } from '../../adapters/validators/email-validator-adapter';

export const makeLoginValidation = () => {
  const validations: IValidation[] = [];

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
