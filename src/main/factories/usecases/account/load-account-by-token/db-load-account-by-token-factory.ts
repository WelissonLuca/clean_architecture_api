import { DbLoadAccountByToken } from '@data/useCases/load-account-by-token/db-load-account-by-token';
import { ILoadAccountByToken } from '@domain/useCases/load-account-by-token';
import { JwtAdapter } from '@infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '@infra/db/mongodb/account/account-mongo-repository';
import env from '@main/config/env';

export const makeDbLoadAccountByToken = (): ILoadAccountByToken => {
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const accountMongoRepository = new AccountMongoRepository();
  return new DbLoadAccountByToken(jwtAdapter, accountMongoRepository);
};
