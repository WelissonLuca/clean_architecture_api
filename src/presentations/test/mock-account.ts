import { AccountModel } from '@domain/models/account';
import { mockAccountModel } from '@domain/test';
import {
  IAddAccount,
  AddAccountParams,
} from '@domain/useCases/account/addAccount';
import {
  IAuthentication,
  IAuthenticationParams,
} from '@domain/useCases/account/authentication';
import { ILoadAccountByToken } from '@presentations/middlewares/auth-middleware-protocols';

export const mockAddAccount = (): IAddAccount => {
  class AddAccountStub implements IAddAccount {
    async add(account: AddAccountParams): Promise<AccountModel> {
      return Promise.resolve(mockAccountModel());
    }
  }
  return new AddAccountStub();
};

export const mockLoadAccountByToken = (): ILoadAccountByToken => {
  class LoadAccountByTokenStub implements ILoadAccountByToken {
    async load(accessToken: string, role?: string): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccountModel()));
    }
  }

  return new LoadAccountByTokenStub();
};

export const mockAuthentication = (): IAuthentication => {
  class AuthenticationStub implements IAuthentication {
    async auth(authentication: IAuthenticationParams): Promise<string> {
      return Promise.resolve('any_token');
    }
  }
  return new AuthenticationStub();
};
