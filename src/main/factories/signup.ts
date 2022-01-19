import { DbAddAccount } from '../../data/useCases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/cryptography/bcrypter-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/Account';
import { SignupController } from '../../presentations/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';

export const makeSignupController = (): SignupController => {
  const salt = 12;
  const emailValidatorAdapter = new EmailValidatorAdapter();
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  const dbAddAccount = new DbAddAccount(bcryptAdapter, addAccountRepository);

  return new SignupController(emailValidatorAdapter, dbAddAccount);
};
