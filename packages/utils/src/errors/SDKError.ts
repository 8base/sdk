import { ERROR_CODES } from './codes';
import { PACKAGES } from './packages';

class SDKError extends Error {
  public name: string;
  public code: ERROR_CODES;
  public packageName: PACKAGES;
  public message: string;

  constructor(code: ERROR_CODES, packageName: PACKAGES, message: string) {
    super(message);

    this.name = 'SDKError';
    this.code = code;
    this.packageName = packageName;
    this.message = message;
  }

  public toString() {
    return `${this.name} in ${this.packageName}: ${this.code}, ${this.message}`;
  }

  public toJSON() {
    return {
      code: this.code,
      message: this.message,
      name: this.name,
      packageName: this.packageName,
    };
  }
}

export { SDKError };
