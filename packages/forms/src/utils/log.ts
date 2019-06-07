
const executeIfNotProduction = (func: Function) => {
  if (process.env.NODE_ENV !== 'production') {
    func();
  }
};

const logError = (message: string): void => {
  executeIfNotProduction(() => {
    // eslint-disable-next-line no-console
    console.error(`Error: ${message}`);
  });
};

const logWarning = (message: string): void => {
  executeIfNotProduction(() => {
    // eslint-disable-next-line no-console
    console.warn(`Warning: ${message}`);
  });
};

export { logError, logWarning };
