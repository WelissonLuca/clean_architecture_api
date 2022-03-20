import { DbAuthentication } from '../../../../../data/useCases/authentication/db-authentcation';
import { IAuthentication } from '../../../../../domain/useCases/authentication';
import { BcryptAdapter } from '../../../../../infra/cryptography/bcrypt-adapter/bcrypter-adapter';
import { JwtAdapter } from '../../../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository';
import env from '../../../../config/env';

export const makeDbAuthenticaiton = (): IAuthentication => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  return new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
};
