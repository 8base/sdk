// @flow
import ejs from 'ejs';

// $FlowIgnore
import fieldsInputsList from './fieldsInputsList.js.ejs';
// $FlowIgnore
import fieldsQueries from './fieldsQueries.js.ejs';
// $FlowIgnore
import createEditComponents from './createEditComponents.js.ejs';
// $FlowIgnore
import routeLink from './routeLink.js.ejs';
// $FlowIgnore
import routeImport from './routeImport.js.ejs';
// $FlowIgnore
import routeComponent from './routeComponent.js.ejs';

export const chunks = {
  fieldsInputsList: (data?: Object) => ejs.render(fieldsInputsList, data),
  fieldsQueries: (data?: Object) => ejs.render(fieldsQueries, data),
  createEditComponents: (data?: Object) => ejs.render(createEditComponents, data),
  routeLink: (data?: Object) => ejs.render(routeLink, data),
  routeImport: (data?: Object) => ejs.render(routeImport, data),
  routeComponent: (data?: Object) => ejs.render(routeComponent, data),
};
