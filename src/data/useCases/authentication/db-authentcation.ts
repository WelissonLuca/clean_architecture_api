import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/useCases/authentication';
import { IHashCompare } from '../../protocols/cripthografy/hash-compare';
import { ITokenGenerator } from '../../protocols/cripthografy/token-generator';
import { ILoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IUpdateAcessTokenRepository } from '../../protocols/db/uodate-acess-token-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashCompare: IHashCompare,
    private readonly tokenGenerator: ITokenGenerator,
    private readonly updateAcessTokenRepository: IUpdateAcessTokenRepository
  ) {}
  async auth(authentication: IAuthenticationModel): Promise<string> {
    const account = await this.loadAccountByEmailRepository.load(
      authentication.email
    );

    if (!account) {
      return null;
    }

    const comparePassword = await this.hashCompare.compare(
      authentication.password,
      account.password
    );

    if (!comparePassword) {
      return null;
    }

    const acessToken = await this.tokenGenerator.generate(account.id);

    await this.updateAcessTokenRepository.update(account.id, acessToken);

    return acessToken;
  }
}
