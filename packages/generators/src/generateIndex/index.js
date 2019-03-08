// @flow

import ejs from 'ejs';
import pluralize from 'pluralize';
import changeCase from 'change-case';
import { formatCode } from '../formatCode';

// $FlowIgnore
import index from './index.js.ejs';

export const generateIndex = ({ tableName, screenName }: *) => {
  const entityName = pluralize.singular(tableName);

  const tableGenerated = ejs.render(index, {
    changeCase,
    pluralize,
    tableName,
    entityName,
    screenName: screenName || entityName,
  });

  return formatCode(tableGenerated);
};

