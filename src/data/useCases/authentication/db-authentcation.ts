import {
  IAuthentication,
  IAuthenticationModel,
} from '../../../domain/useCases/authentication';
import { ILoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository';

export class DbAuthentication implements IAuthentication {
  constructor(
    private readonly loadAccountByEmailRepository: ILoadAccountByEmailRepository
  ) {}
  async auth(authentication: IAuthenticationModel): Promise<string> {
    await this.loadAccountByEmailRepository.load(authentication.email);
    return null;
  }
}
