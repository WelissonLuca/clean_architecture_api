export interface IEncrypter {
  hasher(value: string): Promise<string>;
}
