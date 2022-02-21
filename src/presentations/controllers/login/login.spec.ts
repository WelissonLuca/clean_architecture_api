/* eslint-disable new-cap */
import { MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http';
import { IEmailValidator } from '../../protocols/email-validator';
import { IHttpRequest } from '../../protocols/http';
import { LoginController } from './login';

interface ISutTypes {
  sut: LoginController;
  emailValidatoStub: IEmailValidator;
}
const makeEmailValidator = (): IEmailValidator => {
  class EmailValidatorStub implements IEmailValidator {
    isValid(email: string): boolean {
      return true;
    }
  }
  return new EmailValidatorStub();
};
const makeSut = (): ISutTypes => {
  const emailValidatoStub = makeEmailValidator();
  const sut = new LoginController(emailValidatoStub);
  return {
    sut,
    emailValidatoStub,
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

    expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
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
});
