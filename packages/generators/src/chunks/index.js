// @flow
import ejs from 'ejs';

// $FlowIgnore
import fieldsInputsList from './fieldsInputsList.js.ejs';
// $FlowIgnore
import fieldsQueries from './fieldsQueries.js.ejs';
// $FlowIgnore
import fieldsFileInput from './fieldsFileInput.js.ejs';

export const chunks = {
  fieldsInputsList: (data?: Object) => ejs.render(fieldsInputsList, data),
  fieldsQueries: (data?: Object) => ejs.render(fieldsQueries, data),
  fieldsFileInput: (data?: Object) => ejs.render(fieldsFileInput, data),
};

