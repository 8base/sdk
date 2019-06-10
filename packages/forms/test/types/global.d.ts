// tslint:disable

declare namespace NodeJS {
  export interface Global {
    sleep: (ms: number) => Promise<any>;
    submitForm: (form: any) => any;
  }
}
