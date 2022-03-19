export class AccessDenied extends Error {
  constructor() {
    super(`Access denied`);
    this.name = 'AccessDenied';
  }
}
