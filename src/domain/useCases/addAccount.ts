import { AccountModel } from '../models/account';

export type AddAccountModel = {
  name: string;
  email: string;
  password: string;
};

export interface IAddAccount {
  add(account: AddAccountModel): Promise<AccountModel>;
}
