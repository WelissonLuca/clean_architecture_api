import { CompareFieldsValidation } from '../../presentations/helpers/validators/compare-fields-validation';
import { RequiredFieldValidation } from '../../presentations/helpers/validators/required-field-validation';
import { IValidation } from '../../presentations/helpers/validators/validation';
import { ValidationComposite } from '../../presentations/helpers/validators/validation-composite';

export const makeSignupValidation = () => {
  const validations: IValidation[] = [];

  for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
    validations.push(new RequiredFieldValidation(field));
  }
  validations.push(
    new CompareFieldsValidation('password', 'passwordConfirmation')
  );
  return new ValidationComposite(validations);
};
