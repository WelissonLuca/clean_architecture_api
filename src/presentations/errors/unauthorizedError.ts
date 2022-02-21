export class UnauthorizedError extends Error {
  constructor(stack?: string) {
    super('Unauthorized');
    this.name = 'UnauthorizedError';
  }
}
