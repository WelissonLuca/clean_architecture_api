import { MissingParamError } from '@presentations/errors';
import { mockValidation } from '@validation/test';

import { ValidationComposite, IValidation } from './index';

type SutTypes = {
  sut: ValidationComposite;
  validationStubs: IValidation[];
};

const makeSut = (): SutTypes => {
  const validationStubs = [mockValidation(), mockValidation()];
  const sut = new ValidationComposite([...validationStubs]);
  return {
    sut,
    validationStubs,
  };
};
describe('ValidationComposite Validation', () => {
  it('should return an error if any validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  it('should return the first error if more then one validation fails', () => {
    const { sut, validationStubs } = makeSut();
    jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(new Error());
    jest
      .spyOn(validationStubs[1], 'validate')
      .mockReturnValueOnce(new MissingParamError('field'));
    const error = sut.validate({ field: 'any_value' });
    expect(error).toEqual(new Error());
  });

  it('should not return if validation succeds', () => {
    const { sut } = makeSut();

    const error = sut.validate({ field: 'any_value' });
    expect(error).toBeFalsy();
  });
});
