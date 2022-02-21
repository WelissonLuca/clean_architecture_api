/* eslint-disable new-cap */
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, unauthorized } from '../../helpers/http';
import { LoginController } from './login';
import {
  IHttpRequest,
  IEmailValidator,
  IAuthentication,
} from './login-protocols';

interface ISutTypes {
  sut: LoginController;
  emailValidatoStub: IEmailValidator;
  authenticationStub: IAuthentication;
}

const makeAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(email: string, password: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new AuthenticationStub();
};

const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): ISutTypes => {
  const authenticationStub = makeAuthentication();
  const emailValidatoStub = makeEmailValidator();
  const sut = new LoginController(emailValidatoStub, authenticationStub);
  return {
    sut,
    emailValidatoStub,
    authenticationStub,
  };
};

const makeFakeRequest = (): IHttpRequest => ({
  body: {
    email: 'valid@gmail.com',
    password: 'valid_password',
  },
});

describe('Login Controller', () => {
  it('Should return 400 if no email is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        password: 'any_password',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
  });

  it('Should return 400 if no password is provided', async () => {
    const { sut } = makeSut();
    const httpRequest = {
      body: {
        email: 'any_email',
      },
    };

    const httpResponse = await sut.handle(httpRequest);

    expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
  });

  it('Should return 400 if invalid email is provided', async () => {
    const { sut, emailValidatoStub } = makeSut();
    jest.spyOn(emailValidatoStub, 'isValid').mockReturnValueOnce(false);

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
  });

  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatoStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatoStub, 'isValid');

    await sut.handle(makeFakeRequest());

    expect(isValidSpy).toHaveBeenCalledWith('valid@gmail.com');
  });

  it('Should return 500 if email validator throws', async () => {
    const { sut, emailValidatoStub } = makeSut();
    jest.spyOn(emailValidatoStub, 'isValid').mockImplementationOnce(() => {
      throw new Error();
    });

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });

  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(makeFakeRequest());

    expect(authSpy).toHaveBeenCalledWith('valid@gmail.com', 'valid_password');
  });

  it('Should return 400 if invalid credentials are provided', async () => {
    const { sut, authenticationStub } = makeSut();
    jest
      .spyOn(authenticationStub, 'auth')
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(unauthorized());
  });
});
