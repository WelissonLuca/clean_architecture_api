import { IAccountModel } from '../../../domain/models/account';
import { IDecrypter } from '../../protocols/cripthografy/decrypter';
import { ILoadAccountByTokenRepository } from '../../protocols/db/account/load-account-by-token-repository';

export class DbLoadAccountByToken {
  constructor(
    private readonly decrypter: IDecrypter,
    private readonly loadAccountByTokenRepository: ILoadAccountByTokenRepository
  ) {}
  async load(token: string, role?: string): Promise<IAccountModel> {
    const accessToken = await this.decrypter.decrypt(token);
    if (accessToken) {
      await this.loadAccountByTokenRepository.loadByToken(accessToken, role);
    }

    return new Promise((resolve) => resolve(null));
  }
}
