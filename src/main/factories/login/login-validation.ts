import { EmailValidation } from '../../../presentations/helpers/validators/email-validation';
import { RequiredFieldValidation } from '../../../presentations/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../../presentations/helpers/validators/validation-composite';
import { IValidation } from '../../../presentations/protocols/validation';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = () => {
  const validations: IValidation[] = [];

  for (const field of ['email', 'password']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
  return new ValidationComposite(validations);
};
