export interface ILogErrorRepository {
  log(stackError: string): Promise<void>;
}
