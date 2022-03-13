import { MissingParamError } from '../../presentations/errors';
import { IValidation, RequiredFieldValidation } from './index';

const makeSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};
describe('RequiredField Validation', () => {
  it('should return a missing param error if validation fails', () => {
    const sut = makeSut();

    const error = sut.validate({ name: 'any_name' });

    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should not return a missing param error if validation success', () => {
    const sut = makeSut();

    const error = sut.validate({ field: 'any_name' });

    expect(error).toBeFalsy();
  });
});
