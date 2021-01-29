const executeIfNotProduction = (func: () => void) => {
  if (process.env.NODE_ENV !== 'production') {
    func();
  }
};

const logError = (message: string): void => {
  executeIfNotProduction(() => {
    console.error(`Error: ${message}`); // tslint:disable-line
  });
};

const logWarning = (message: string): void => {
  executeIfNotProduction(() => {
    console.warn(`Warning: ${message}`); // tslint:disable-line
  });
};

export { logError, logWarning };
