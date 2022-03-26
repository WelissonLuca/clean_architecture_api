import { mockAccountModel, throwError } from '@domain/test';
import { EmailInUseError, MissingParamError } from '@presentations/errors';
import {
  badRequest,
  forbidden,
  ok,
  serverError,
} from '@presentations/helpers/http/http';
import {
  mockAuthentication,
  mockValidation,
  mockAddAccount,
} from '@presentations/test';

import { SignupController } from './signup-controller';
import {
  AccountModel,
  IAddAccount,
  AddAccountParams,
  HttpRequest,
  IValidation,
  IAuthentication,
} from './signup-controller-protocols';

type SutTypes = {
  sut: SignupController;
  addAccountStub: IAddAccount;
  validationStub: IValidation;
  authenticationStub: IAuthentication;
};

const makeSut = (): SutTypes => {
  const addAccountStub = mockAddAccount();
  const validationStub = mockValidation();
  const authenticationStub = mockAuthentication();

  const sut = new SignupController(
    addAccountStub,
    validationStub,
    authenticationStub
  );

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub,
  };
};

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any name',
    email: 'any email',
    password: 'any password',
    passwordConfirmation: 'any password',
  },
});

describe('Signup Controller', () => {
  it('should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = makeSut();

    const addSpy = jest.spyOn(addAccountStub, 'add');

    await sut.handle(mockRequest());

    expect(addSpy).toHaveBeenCalledWith({
      name: 'any name',
      email: 'any email',
      password: 'any password',
    });
  });

  it('should return 403 if add account returns null', async () => {
    const { sut, addAccountStub } = makeSut();

    jest
      .spyOn(addAccountStub, 'add')
      .mockReturnValueOnce(Promise.resolve(null));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new EmailInUseError()));
  });

  it('should return 200 if valid data is provided', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }));
  });

  it('should return call validation with correct value', async () => {
    const { sut, validationStub } = makeSut();

    const validateSpy = jest.spyOn(validationStub, 'validate');

    const httpRequest = mockRequest();

    await sut.handle(httpRequest);

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
  });

  it('should return 400 if validation return an error', async () => {
    const { sut, validationStub } = makeSut();

    jest
      .spyOn(validationStub, 'validate')
      .mockReturnValueOnce(new MissingParamError('any field'));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(
      badRequest(new MissingParamError('any field'))
    );
  });

  it('Should calls Authentication with correct values', async () => {
    const { sut, authenticationStub } = makeSut();
    const authSpy = jest.spyOn(authenticationStub, 'auth');

    await sut.handle(mockRequest());

    expect(authSpy).toHaveBeenCalledWith({
      email: 'any email',
      password: 'any password',
    });
  });
  it('Should return 500 if authentication throws', async () => {
    const { sut, authenticationStub } = makeSut();
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
