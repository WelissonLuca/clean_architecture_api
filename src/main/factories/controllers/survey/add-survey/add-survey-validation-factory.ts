import {
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../../validation/validators';

export const makeAddSurveyValidation = () => {
  const validations: IValidation[] = [];

  for (const field of ['question', 'answers']) {
    validations.push(new RequiredFieldValidation(field));
  }
  return new ValidationComposite(validations);
};
