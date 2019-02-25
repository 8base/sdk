// @flow
import prettier from 'prettier';

export const formatCode = (code: string) => prettier.format(code, {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'babel',
});
