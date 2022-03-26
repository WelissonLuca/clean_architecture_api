import { mockLoadAccountByTokenRepository } from '@data/test';
import { AccountModel } from '@domain/models/account';
import { mockAccountModel, throwError } from '@domain/test';
import { mockLoadAccountByToken } from '@presentations/test';

import { AuthMiddleware } from './auth-middleware';
import {
  HttpRequest,
  ILoadAccountByToken,
  ok,
  forbidden,
  AccessDenied,
  serverError,
} from './auth-middleware-protocols';

type SutTypes = {
  sut: AuthMiddleware;
  loadAccountByTokenStub: ILoadAccountByToken;
};

const mockRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

const makeSut = (role?: string): SutTypes => {
  const loadAccountByTokenStub = mockLoadAccountByToken();
  const authMiddleware = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut: authMiddleware,
    loadAccountByTokenStub,
  };
};
describe('Auth IMiddleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });

  test('Should call load account by token with correct access token', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(mockRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return 403 if load account by token return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });

  test('Should return 200 if load account by token return an account', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(
      ok({
        accountId: 'any_id',
      })
    );
  });

  test('Should return 500 if load account by token throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    loadAccountByTokenStub.load = jest.fn().mockImplementationOnce(throwError);

    const httpResponse = await sut.handle(mockRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
