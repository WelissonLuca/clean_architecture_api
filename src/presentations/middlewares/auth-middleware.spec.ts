import { AccessDenied } from '../errors/access-denied-error';
import { forbidden } from '../helpers/http/http';
import { IHttpRequest } from '../protocols/http';
import { AuthMiddleware } from './auth-middleware';

interface ISutTypes {
  sut: AuthMiddleware;
}

const makeSut = (): ISutTypes => {
  const authMiddleware = new AuthMiddleware();
  return {
    sut: authMiddleware,
  };
};
describe('Auth Middleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { sut } = makeSut();
    const httpResponse = await sut.handle({});

    expect(httpResponse).toEqual(forbidden(new AccessDenied()));
  });
});
