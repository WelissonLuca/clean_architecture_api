import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IEncrypter,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  constructor(ecrypter: IEncrypter) {
    this.encrypter = ecrypter;
  }

  async add(account: IAddAccountModel): Promise<IAccountModel> {
    await this.encrypter.encrypt(account.password);
    return new Promise((resolve) => resolve(null));
  }
}
