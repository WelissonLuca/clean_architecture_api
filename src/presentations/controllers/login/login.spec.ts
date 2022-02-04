import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http';
import { IEmailValidator } from '../../protocols/email-validator';
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

  it('Should call email validator with correct email', async () => {
    const { sut, emailValidatoStub } = makeSut();
    const isValidSpy = jest.spyOn(emailValidatoStub, 'isValid');
    const httpRequest = {
      body: {
        email: 'any_email@gmail.com',
        password: 'any_password',
      },
    };

    await sut.handle(httpRequest);

    expect(isValidSpy).toHaveBeenCalledWith('any_email@gmail.com');
  });
});
