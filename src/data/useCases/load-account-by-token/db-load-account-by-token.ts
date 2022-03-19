import { IAccountModel } from '../../../domain/models/account';
import { IDecrypter } from '../../protocols/cripthografy/decrypter';

export class DbLoadAccountByToken {
  constructor(private readonly decrypter: IDecrypter) {}
  async load(token: string): Promise<IAccountModel> {
    const decryptToken = await this.decrypter.decrypt(token);
    return new Promise((resolve) => resolve(null));
  }
}
