import {
  AddAccountModel,
  AccountModel,
} from '@data/useCases/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
