//@flow

const logError = (message: string): void => {
  if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(message);
  }
};

export { logError };
