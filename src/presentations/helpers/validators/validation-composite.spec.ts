import { MissingParamError } from '../../errors/missingParamError';
import { IValidation } from './validation';
import { ValidationComposite } from './validation-composite';





describe('ValidationComposite Validation', () => {
  it('should return an error if any validation fails', () => {
    class ValidationStub implements IValidation {
      validate(input: any): Error {
        return new MissingParamError('field');
      }
    }

    const validationStub = new ValidationStub();
    const sut = new ValidationComposite([validationStub]);

    const error = sut.validate({ field: 'any_value' });

    expect(error).toEqual(new MissingParamError('field'));
  });
});
