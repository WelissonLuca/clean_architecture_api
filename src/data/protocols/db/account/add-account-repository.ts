import {
  AddAccountModel,
  AccountModel,
} from '@data/useCases/account/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(accountData: AddAccountModel): Promise<AccountModel>;
}
