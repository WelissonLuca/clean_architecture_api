import { DbAddAccount } from '../../data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypter-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/Account';
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log';
import { SignupController } from '../../presentations/controllers/signup/signup';
import { ValidationComposite } from '../../presentations/helpers/validators/validation-composite';
import { IController } from '../../presentations/protocols/controller';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LogControllerDecorator } from '../decorators/logger';
import { makeSignupValidation } from './signup-validation';

export const makeSignupController = (): IController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  const signupController = new SignupController(
    emailValidatorAdapter,
    dbAddAccount,
    makeSignupValidation()
  );
  const logErrorRepository = new LogMongoRepository();

  return new LogControllerDecorator(signupController, logErrorRepository);
};
