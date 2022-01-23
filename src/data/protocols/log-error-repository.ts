export interface ILogErrorRepository {
  logError(stackError: string): Promise<void>;
}
