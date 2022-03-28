import { IDecrypter } from '@data/protocols/cripthografy/decrypter';
import { IEncrypter } from '@data/protocols/cripthografy/encrypter';
import { IHashCompare } from '@data/protocols/cripthografy/hash-compare';
import { IHasher } from '@data/protocols/cripthografy/hasher';

export const mockHasher = (): IHasher => {
  class HasherStub implements IHasher {
    async hash(value: string): Promise<string> {
      return Promise.resolve('hashed_password');
    }
  }

  return new HasherStub();
};

export const mockEncrypter = (): IEncrypter => {
  class EncrypterStub implements IEncrypter {
    async encrypt(value: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new EncrypterStub();
};

export const mockHashCompare = (): IHashCompare => {
  class HashCompareStub implements IHashCompare {
    async compare(value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true);
    }
  }

  return new HashCompareStub();
};

export const mockDecrypter = (): IDecrypter => {
  class DecrypterStub implements IDecrypter {
    async decrypt(value: string): Promise<string> {
      return Promise.resolve('any_token');
    }
  }

  return new DecrypterStub();
};
