import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/useCases/authentication';
import { IHashCompare } from '../../protocols/cripthografy/hash-compare';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashCompare: IHashCompare
  ) {}
  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (!account) {
      return null;
    }

    await this.hashCompare.compare(authentication.password, account.password);

    return account.password;
  }
}
