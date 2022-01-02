import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IEncrypter,
  IAddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  private readonly encrypter: IEncrypter;
  private readonly addAccountRepository: IAddAccountRepository;
  constructor(
    ecrypter: IEncrypter,
    addAccountRepository: IAddAccountRepository
  ) {
    this.encrypter = ecrypter;
    this.addAccountRepository = addAccountRepository;
  }

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.encrypter.encrypt(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
