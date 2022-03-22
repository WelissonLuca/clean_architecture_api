import { AccountModel } from '@domain/models/account';

export interface ILoadAccountByTokenRepository {
  loadByToken(token: string, role?: string): Promise<AccountModel>;
}
