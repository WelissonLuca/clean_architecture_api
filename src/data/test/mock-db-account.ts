import { ILoadAccountByTokenRepository } from '@data/protocols/db/account/load-account-by-token-repository';
import { IUpdateAcessTokenRepository } from '@data/protocols/db/account/uodate-acess-token-repository';
import {
  IAddAccountRepository,
  ILoadAccountByEmailRepository,
} from '@data/useCases/account/add-account/db-add-account-protocols';
import { AccountModel } from '@domain/models/account';
import { mockAccountModel } from '@domain/test';
import { AddAccountParams } from '@domain/useCases/account/addAccount';

export const mockAddAccountRepository = (): IAddAccountRepository => {
  class AddAccountRepositoryStub implements IAddAccountRepository {
    async add(accountData: AddAccountParams): Promise<AccountModel> {
      return new Promise((resolve) => resolve(mockAccountModel()));
    }
  }

  return new AddAccountRepositoryStub();
};

export const mockLoadAccountByEmailRepository =
  (): ILoadAccountByEmailRepository => {
    class LoadAccountByEmailRepositoryStub
      implements ILoadAccountByEmailRepository
    {
      async loadByEmail(email: string): Promise<AccountModel> {
        const account: AccountModel = {
          id: 'any_id',
          name: 'any_name',
          email: 'any_email@mail.com',
          password: 'any_password',
        };
        return new Promise((resolve) => resolve(mockAccountModel()));
      }
    }

    return new LoadAccountByEmailRepositoryStub();
  };

export const mockLoadAccountByTokenRepository =
  (): ILoadAccountByTokenRepository => {
    class LoadAccountByTokenRepositoryStub
      implements ILoadAccountByTokenRepository
    {
      async loadByToken(token: string, role?: string): Promise<AccountModel> {
        return new Promise((resolve) => resolve(mockAccountModel()));
      }
    }
    return new LoadAccountByTokenRepositoryStub();
  };

export const mockUpdateAcessTokenRepositoryStub =
  (): IUpdateAcessTokenRepository => {
    class UpdateAcessTokenRepositoryStub
      implements IUpdateAcessTokenRepository
    {
      async updateAccessToken(id: string, token: string): Promise<void> {
        return new Promise((resolve) => resolve());
      }
    }

    return new UpdateAcessTokenRepositoryStub();
  };
