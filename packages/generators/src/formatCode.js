// @flow
import prettier from 'prettier/standalone';
import prettierBabylon from 'prettier/parser-babylon';

export const formatCode = (code: string) => prettier.format(code, {
  printWidth: 120,
  singleQuote: true,
  trailingComma: 'es5',
  parser: 'babel',
  plugins: [prettierBabylon],
});
