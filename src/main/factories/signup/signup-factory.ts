import { DbAddAccount } from '../../../data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypter-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { SignupController } from '../../../presentations/controllers/signup/signup-controller';
import { IController } from '../../../presentations/protocols';
import { LogControllerDecorator } from '../../decorators/log-controller-decorator';
import { makeSignupValidation } from './signup-validation-factory';

export const makeSignupController = (): IController => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  const signupController = new SignupController(
    dbAddAccount,
    makeSignupValidation()
  );
  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signupController, logErrorRepository);
};
