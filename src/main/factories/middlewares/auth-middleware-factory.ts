import { AuthMiddleware } from '../../../presentations/middlewares/auth-middleware';
import { IMiddleware } from '../../../presentations/protocols/middleware';
import { makeDbLoadAccountByToken } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory';

export const makeAuthMiddleware = (role?: string): IMiddleware => {
  return new AuthMiddleware(makeDbLoadAccountByToken(), role);
};
