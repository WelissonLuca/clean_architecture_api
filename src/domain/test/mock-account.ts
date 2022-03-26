import { AccountModel } from '@domain/models/account';
import { AddAccountParams } from '@domain/useCases/account/addAccount';
import { IAuthenticationParams } from '@domain/useCases/account/authentication';

export const mockAddAccountParams = (): AddAccountParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password',
});

export const mockAccountModel = (): AccountModel => ({
  ...mockAddAccountParams(),
  id: 'any_id',
});

export const mockAuthentication = (): IAuthenticationParams =>
  ({
    email: 'any_email@mail.com',
    password: 'any_password',
  } as IAuthenticationParams);
