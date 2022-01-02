import { IEmailValidator } from '../presentations/protocols/emailValidator';

export class EmailValidatorAdapter implements IEmailValidator {
  isValid(email: string): boolean {
    return false;
  }
}
