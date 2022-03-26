import { AccountModel } from '../../models/account';

export type AddAccountParams = {
  name: string;
  email: string;
  password: string;
};

export interface IAddAccount {
  add(account: AddAccountParams): Promise<AccountModel>;
}
