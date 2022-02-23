import { InvalidParamError } from '../../errors/invalidParamError';
import { CompareFieldsValidation } from './compare-fields-validation';

const makeSut = (): CompareFieldsValidation => {
  return new CompareFieldsValidation('field', 'fieldToCompare');
};
describe('CompareFields Validation', () => {
  it('should return a missing param error if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'other_value',
    });

    expect(error).toEqual(new InvalidParamError('fieldToCompare'));
  });

  it('should not return a missing param error if validation success', () => {
    const sut = makeSut();

    const error = sut.validate({
      field: 'any_value',
      fieldToCompare: 'any_value',
    });

    expect(error).toBeFalsy();
  });
});
