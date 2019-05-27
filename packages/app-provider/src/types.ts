
export type ApolloContainerPassedProps = {
  uri: string,
  onRequestSuccess: (request: {[key: string]: any}) => void,
  onRequestError: (request: { [key: string]: any }) => void,
  extendLinks?: (links: Array<{ [key: string]: Function }>) => Array<{ [key: string]: Function }>,
};

