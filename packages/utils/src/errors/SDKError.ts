
class SDKError extends Error {
  name: string;
  code: string;
  packageName: string;
  message: string;

  constructor(code: string, packageName: string, message: string) {
    super(message);

    this.name = 'SDKError';
    this.code = code;
    this.packageName = packageName;
    this.message = message;
  }

  toString() {
    return `${this.name} in ${this.packageName}: ${this.code}, ${this.message}`;
  }

  toJSON() {
    return {
      name: this.name,
      packageName: this.packageName,
      code: this.code,
      message: this.message,
    };
  }
}

export { SDKError };

