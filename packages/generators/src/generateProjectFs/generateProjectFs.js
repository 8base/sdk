// @flow
import changeCase from 'change-case';
import type { TableSchema } from '@8base/utils';

import { generateCreateForm } from '../generateCreateForm/createForm';
import { generateEditForm } from '../generateEditForm/editForm';
import { generateDeleteForm } from '../generateDeleteForm/deleteForm';
import { generateTable } from '../generateTable/table';
import { generateIndex } from '../generateIndex';
import { generateRoot } from '../generateRoot/generateRoot';
import type { ScreenTable, GeneratorsConfig } from '../types';

type GenerateProjectFsData = {
  tablesList: TableSchema,
  screens: ScreenTable[],
}

const getCreateFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}CreateDialog.js`;
const getEditFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}EditDialog.js`;
const getDeleteFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}DeleteDialog.js`;
const getTableFileName = (screenName: string) => `${changeCase.pascal(screenName)}Table.js`;
const getScreenFolderName = (screenName: string) => changeCase.camel(screenName);

export const generateProjectFs = ({ tablesList, screens }: GenerateProjectFsData, config: GeneratorsConfig) => {
  const fs = {};

  screens.forEach(({ screenName, tableName, tableFields, formFields }) => {
    const generatorData = { tablesList, tableName, screenName };
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
  });

  fs['src/Root.js'] = generateRoot(screens);

  return fs;
};

