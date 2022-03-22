import { IAccountModel } from '@domain/models/account';

import { AuthMiddleware } from './auth-middleware';
import {
  IHttpRequest,
  ILoadAccountByToken,
  ok,
  forbidden,
  AccessDenied,
  serverError,
} from './auth-middleware-protocols';

interface ISutTypes {
  sut: AuthMiddleware;
  loadAccountByTokenStub: ILoadAccountByToken;
}

const makeFakeAccount = (): IAccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@email.com',
  password: 'valid_password',
});

const makeFakeRequest = (): IHttpRequest => ({
  headers: {
    'x-access-token': 'any_token',
  },
});

class LoadAccountByTokenStub implements ILoadAccountByToken {
  async load(accessToken: string, role?: string): Promise<IAccountModel> {
    return new Promise((resolve) => resolve(makeFakeAccount()));
  }
}

const makeSut = (role?: string): ISutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
  const authMiddleware = new AuthMiddleware(loadAccountByTokenStub, role);
  return {
    sut: authMiddleware,
    loadAccountByTokenStub,
  };
};
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });

  test('Should call load account by token with correct access token', async () => {
    const role = 'any_role';
    const { sut, loadAccountByTokenStub } = makeSut(role);
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_token', 'any_role');
  });

  test('Should return 403 if load account by token return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });

  test('Should return 200 if load account by token return an account', async () => {
    const { sut } = makeSut();

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(
      ok({
        accountId: 'valid_id',
      })
    );
  });

  test('Should return 500 if load account by token throws', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    loadAccountByTokenStub.load = jest
      .fn()
      .mockReturnValueOnce(
        new Promise((resolve, reject) => reject(new Error()))
      );

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(serverError(new Error()));
  });
});
