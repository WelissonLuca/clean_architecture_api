import { InvalidParamError } from '@presentations/errors';
import { mockEmailValidator } from '@validation/test/mock-email-validator';

import { IEmailValidator } from '../protocols/email-validator';
import { EmailValidation } from './index';

type SutTypes = {
  sut: EmailValidation;
  emailValidatorStub: IEmailValidator;
};

const makeSut = (): SutTypes => {
  const emailValidatorStub = mockEmailValidator();

  const sut = new EmailValidation('email', emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('Email Validation', () => {
  it('Should return an erro if email validator return false', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const error = sut.validate({
      email: 'any_email@mail.com',
    });

    expect(error).toEqual(new InvalidParamError('email'));
  });
  it('should call email validator with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    sut.validate({
      email: 'any_email@mail.com',
    });

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com');
  });

  it('should return 500 if email validator throws', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    expect(sut.validate).toThrow();
  });
});
