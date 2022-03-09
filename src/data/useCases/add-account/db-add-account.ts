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
    const account = await this.loadAccountByEmailRepository.loadByEmail(
      accountData.email
    );

    if (account) {
      return null;
    }
    const hashedPassword = await this.hash.hash(accountData.password);
    const newAccount = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return newAccount;
  }
}
