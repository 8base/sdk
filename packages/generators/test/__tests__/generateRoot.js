// @flow

import { generateRoot } from '../../src';


it('should generate update form by the table name', () => {
  const generatedRoot = generateRoot([{
    screenName: 'post',
    routeUrl: '/post',
  }, {
    screenName: 'author',
    routeUrl: '/author',
  }]);

  expect(generatedRoot).toMatchSnapshot();
});
