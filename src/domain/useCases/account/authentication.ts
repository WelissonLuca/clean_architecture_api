export interface IAuthenticationParams {
  email: string;
  password: string;
}

export interface IAuthentication {
  auth(authentication: IAuthenticationParams): Promise<string>;
}
