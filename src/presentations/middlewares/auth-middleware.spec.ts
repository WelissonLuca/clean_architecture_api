import { IAccountModel } from '../../domain/models/account';
import { ILoadAccountByToken } from '../../domain/useCases/load-account-by-token';
import { AccessDenied } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http';
import { IHttpRequest } from '../protocols/http';
import { AuthMiddleware } from './auth-middleware';

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

const makeSut = (): ISutTypes => {
  const loadAccountByTokenStub = new LoadAccountByTokenStub();
  const authMiddleware = new AuthMiddleware(loadAccountByTokenStub);
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
    const { sut, loadAccountByTokenStub } = makeSut();
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load');
    await sut.handle(makeFakeRequest());

    expect(loadSpy).toHaveBeenCalledWith('any_token');
  });

  test('Should return 403 if load account by token return null', async () => {
    const { sut, loadAccountByTokenStub } = makeSut();

    jest
      .spyOn(loadAccountByTokenStub, 'load')
      .mockReturnValueOnce(new Promise((resolve) => resolve(null)));

    const httpResponse = await sut.handle(makeFakeRequest());

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });
});
