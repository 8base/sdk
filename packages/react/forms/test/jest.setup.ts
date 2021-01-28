import * as TestUtils from 'react-dom/test-utils';

global.sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

global.submitForm = (form) => {
  const submitButton = TestUtils.findRenderedDOMComponentWithTag(form, 'button');

  TestUtils.Simulate.submit(submitButton);
};
