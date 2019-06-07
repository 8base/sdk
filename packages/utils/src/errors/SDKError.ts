class SDKError extends Error {
  public name: string;
  public code: string;
  public packageName: string;
  public message: string;

  constructor(code: string, packageName: string, message: string) {
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
