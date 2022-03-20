import {
  IValidation,
  RequiredFieldValidation,
  ValidationComposite,
} from '../../../../../validation/validators';
import { makeAddSurveyValidation } from './add-survey-validation-factory';

jest.mock('../../../../../validation/validators/validation-composite');

describe('AddSurveyValidation factory', () => {
  test('Should call validation composite with all validations', () => {
    makeAddSurveyValidation();
    const validations: IValidation[] = [];

    for (const field of ['question', 'answers']) {
      validations.push(new RequiredFieldValidation(field));
    }

    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
