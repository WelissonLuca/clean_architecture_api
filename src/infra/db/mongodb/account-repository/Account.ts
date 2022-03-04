import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/load-account-by-email-repository';
import { IAddAccountRepository } from '../../../../data/useCases/add-account/db-add-account-protocols';
import { IAccountModel } from '../../../../domain/models/account';
import { IAddAccountModel } from '../../../../domain/useCases/addAccount';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository
  implements IAddAccountRepository, ILoadAccountByEmailRepository
{
  async add(accountData: IAddAccountModel): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const result = await accountCollection.insertOne(accountData);

    return MongoHelper.map(result.ops[0]);
  }

  async loadByEmail(email: string): Promise<IAccountModel> {
    const accountCollection = await MongoHelper.getCollection('accounts');

    const account = await accountCollection.findOne({ email });

    return account && MongoHelper.map(account);
  }
}
