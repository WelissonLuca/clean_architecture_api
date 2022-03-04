import { DbAuthentication } from '../../../data/useCases/authentication/db-authentcation';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypter-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentations/controllers/login/login-controller';
import { IController } from '../../../presentations/protocols/controller';
import env from '../../config/env';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';

export const makeLoginController = (): IController => {
  const accountMongoRepository = new AccountMongoRepository();
  const bcryptAdapter = new BcryptAdapter(12);
  const jwtAdapter = new JwtAdapter(env.jwtSecret);
  const dbAuthentication = new DbAuthentication(
    accountMongoRepository,
    bcryptAdapter,
    jwtAdapter,
    accountMongoRepository
  );
  const loginController = new LoginController(
    dbAuthentication,
    makeLoginValidation()
  );
  const logMongoRepository = new LogMongoRepository();
  return new LogControllerDecorator(loginController, logMongoRepository);
};
