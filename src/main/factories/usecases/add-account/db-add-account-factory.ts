import { DbAddAccount } from '../../../../data/useCases/add-account/db-add-account';
import { IAddAccount } from '../../../../domain/useCases/addAccount';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypter-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';

export const makeDbAddAccount = (): IAddAccount => {
  const salt = 12;
  const bcryptAdapter = new BcryptAdapter(salt);
  const addAccountRepository = new AccountMongoRepository();
  return new DbAddAccount(bcryptAdapter, addAccountRepository);
};
