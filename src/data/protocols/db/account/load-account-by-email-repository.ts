import { AccountModel } from '@domain/models/account';

export interface ILoadAccountByEmailRepository {
  loadByEmail(email: string): Promise<AccountModel>;
}
