import { InvalidParamError } from '../errors/invalidParamError';
import { MissingParamError } from '../errors/missingParamError';
import { IEmailValidator } from '../protocols/emailValidator';
import { SignupController } from './signup';

interface ISutTypes {
  sut: SignupController;
  emailValidatorStub: IEmailValidator;
}

const makeSut = (): ISutTypes => {
  class EmailValidatorStub {
    isValid(email: string): boolean {
      return true;
    }
  }
  const emailValidatorStub = new EmailValidatorStub();
  const sut = new SignupController(emailValidatorStub);

  return {
    sut,
    emailValidatorStub,
  };
};

describe('Signup Controller', () => {
  it('should return 400 if no name is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        email: 'any email',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('name'));
  });

  it('should return 400 if no email is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any name',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('email'));
  });

  it('should return 400 if no password is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any email',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new MissingParamError('password'));
  });

  it('should return 400 if no passwordConfirmation is provided', () => {
    const { sut } = makeSut();

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any email',
        password: 'any password',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(
      new MissingParamError('passwordConfirmation')
    );
  });

  it('should return 400 if an invalid email is provided', () => {
    const { sut, emailValidatorStub } = makeSut();

    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'invalid email',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    const httpResponse = sut.handle(httpRequest);

    expect(httpResponse.statusCode).toBe(400);
    expect(httpResponse.body).toEqual(new InvalidParamError('email'));
  });

  it('should call email valitor with correct email', () => {
    const { sut, emailValidatorStub } = makeSut();

    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

    const httpRequest = {
      body: {
        name: 'any name',
        email: 'any email',
        password: 'any password',
        passwordConfirmation: 'any password confirmation',
      },
    };

    sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any email');
  });
});
