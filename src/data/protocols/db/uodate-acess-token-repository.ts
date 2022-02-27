export interface IUpdateAcessTokenRepository {
  update(id: string, token: string): Promise<void>;
}
