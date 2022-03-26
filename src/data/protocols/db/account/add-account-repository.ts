import {
  AddAccountParams,
  AccountModel,
} from '@data/useCases/account/add-account/db-add-account-protocols';

export interface IAddAccountRepository {
  add(accountData: AddAccountParams): Promise<AccountModel>;
}
