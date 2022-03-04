import {
  IAddAccount,
  IAddAccountModel,
  IAccountModel,
  IHasher,
  IAddAccountRepository,
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
  constructor(
    private readonly hash: IHasher,
    private readonly addAccountRepository: IAddAccountRepository
  ) {}

  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const hashedPassword = await this.hash.hash(accountData.password);
    const account = await this.addAccountRepository.add({
      ...accountData,
      password: hashedPassword,
    });

    return account;
  }
}
