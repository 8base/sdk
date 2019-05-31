

declare namespace NodeJS {
  export interface Global {
    mockRequest: (
      endpoint: string, 
      status?: number,
      response?: { [key: string]: any }
    ) => Promise<any> 
  }
}
