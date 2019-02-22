// @flow
import ejs from 'ejs';

// $FlowIgnore
import fieldsInputsList from './fieldsInputsList.js.ejs';
// $FlowIgnore
import fieldsQueries from './fieldsQueries.js.ejs';
// $FlowIgnore
import fieldsFileInput from './fieldsFileInput.js.ejs';
// $FlowIgnore
import fieldsList from './fieldsList.js.ejs';
// $FlowIgnore
import addressField from './addressField.js.ejs';
// $FlowIgnore
import phoneField from './phoneField.js.ejs';

export const chunks = {
  fieldsInputsList: (data?: Object) => ejs.render(fieldsInputsList, data),
  fieldsQueries: (data?: Object) => ejs.render(fieldsQueries, data),
  fieldsFileInput: (data?: Object) => ejs.render(fieldsFileInput, data),
  fieldsList: (data?: Object) => ejs.render(fieldsList, data),
  addressField: (data?: Object) => ejs.render(addressField, data),
  phoneField: (data?: Object) => ejs.render(phoneField, data),
};
