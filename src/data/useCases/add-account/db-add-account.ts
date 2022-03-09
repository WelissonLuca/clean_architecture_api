import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IHasher,
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly hash: IHasher,
    private readonly addAccountRepository: IAddAccountRepository,
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
    const hashedPassword = await this.hash.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
