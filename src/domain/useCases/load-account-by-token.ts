import { AccountModel } from '../models/account';

export interface ILoadAccountByToken {
  load(accessToken: string, role?: string): Promise<AccountModel>;
}
