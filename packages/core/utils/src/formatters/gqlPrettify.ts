import prettier from 'prettier';
import parserGraphql from 'prettier/parser-graphql';

export const gqlPrettify = (gqlString: string): string => {
  return prettier.format(gqlString, {
    parser: 'graphql',
    plugins: [parserGraphql],
  });
};
