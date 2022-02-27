export interface IHasher {
  hasher(value: string): Promise<string>;
}
