import {
  IDecrypter,
  ILoadAccountByTokenRepository,
  AccountModel,
} from './db-load-account-by-token-protocols';

export class DbLoadAccountByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}
  async load(accessToken: string, role?: string): Promise<AccountModel> {
    const token = await this.decrypter.decrypt(accessToken);
    if (token) {
      const account = await this.loadAccountByTokenRepository.loadByToken(
        accessToken,
        role
      );
      if (account) {
        return account;
      }
    }

    return new Promise((resolve) => resolve(null));
  }
}
