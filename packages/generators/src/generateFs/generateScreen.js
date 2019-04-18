// @flow
import os from 'os';
import type { TableSchema } from '@8base/utils';
import changeCase from 'change-case';

import { generateCreateForm } from '../generateFiles/generateCreateForm/createForm';
import { generateEditForm } from '../generateFiles/generateEditForm/editForm';
import { generateDeleteForm } from '../generateFiles/generateDeleteForm/deleteForm';
import { generateTable } from '../generateFiles/generateTable/table';
import { generateIndex } from '../generateFiles/generateIndex';
import { chunks } from '../generateFiles/chunks';
import { formatCode } from '../formatCode';
import { getCreateFormFileName, getEditFormFileName, getDeleteFormFileName, getTableFileName, getScreenFolderName } from './generateFileNames';
import type { ScreenTable, GeneratorsCommonConfig } from '../types';

type GenerateProjectFsData = {
  tablesList: TableSchema[],
  screen: ScreenTable,
  rootFile?: string,
}

const PAGE_CONSTANTS = {
  APP_PAGES_IMPORTS: '/** __APP_PAGES_IMPORTS__ */',
  APP_ROUTE_LINKS: '{/** __APP_ROUTE_LINKS__ */}',
  APP_ROUTES: '{/** __APP_ROUTES__ */}',
};

export const generateScreen = ({ tablesList, screen, rootFile }: GenerateProjectFsData, config: GeneratorsCommonConfig) => {
  const fs = {};
  const { screenName, tableName, tableFields, formFields } = screen;
  const generatorData = { tablesList, tableName, screenName };
  const routeUrl = `/${changeCase.camel(screenName)}`;

  fs[`src/routes/${getScreenFolderName(screenName)}/${getCreateFormFileName(screenName)}`] =
    generateCreateForm(generatorData, { ...config, includeColumns: formFields });

  fs[`src/routes/${getScreenFolderName(screenName)}/${getEditFormFileName(screenName)}`] =
    generateEditForm(generatorData, { ...config, includeColumns: formFields });

  fs[`src/routes/${getScreenFolderName(screenName)}/${getDeleteFormFileName(screenName)}`] =
    generateDeleteForm(generatorData);

  fs[`src/routes/${getScreenFolderName(screenName)}/${getTableFileName(screenName)}`] =
    generateTable(generatorData, { ...config, includeColumns: tableFields });

  fs[`src/routes/${getScreenFolderName(screenName)}/index.js`] =
    generateIndex(generatorData);

  if (typeof rootFile === 'string') {
    fs['src/Root.js'] = formatCode(
      rootFile
        .replace(`${PAGE_CONSTANTS.APP_PAGES_IMPORTS}`, `${PAGE_CONSTANTS.APP_PAGES_IMPORTS}${os.EOL}${chunks.routeImport({ screenName, changeCase })}`)
        .replace(`${PAGE_CONSTANTS.APP_ROUTE_LINKS}`, `${PAGE_CONSTANTS.APP_ROUTE_LINKS}${os.EOL}${chunks.routeLink({ screenName, routeUrl, changeCase })}`)
        .replace(`${PAGE_CONSTANTS.APP_ROUTES}`, `${PAGE_CONSTANTS.APP_ROUTES}${os.EOL}${chunks.routeComponent({ screenName, routeUrl, changeCase })}`),
    );
  }

  return fs;
};

