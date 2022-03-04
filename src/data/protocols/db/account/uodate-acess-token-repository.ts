export interface IUpdateAcessTokenRepository {
  updateAccessToken(id: string, token: string): Promise<void>;
}
