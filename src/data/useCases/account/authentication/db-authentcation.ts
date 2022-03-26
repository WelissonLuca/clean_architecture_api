import {
  IAuthentication,
  IAuthenticationParams,
  IHashCompare,
  ILoadAccountByEmailRepository,
  IEncrypter,
  IUpdateAcessTokenRepository,
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository,
    private readonly hashCompare: IHashCompare,
    private readonly encrypter: IEncrypter,
    private readonly updateAcessTokenRepository: IUpdateAcessTokenRepository
  ) {}
  async auth(authentication: IAuthenticationParams): Promise<string> {
    const account = await this.loadAccountByEmailRepository.loadByEmail(
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

    const acessToken = await this.encrypter.encrypt(account.id);

    await this.updateAcessTokenRepository.updateAccessToken(
      account.id,
      acessToken
    );

    return acessToken;
  }
}
