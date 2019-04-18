// @flow
import type { TableSchema } from '@8base/utils';
import { generateCreateForm } from '../generateFiles/generateCreateForm/createForm';
import { generateEditForm } from '../generateFiles/generateEditForm/editForm';
import { generateDeleteForm } from '../generateFiles/generateDeleteForm/deleteForm';
import { generateTable } from '../generateFiles/generateTable/table';
import { generateIndex } from '../generateFiles/generateIndex';
import { generateRoot } from '../generateFiles/generateRoot/generateRoot';
import { getCreateFormFileName, getEditFormFileName, getDeleteFormFileName, getTableFileName, getScreenFolderName } from './generateFileNames';
import type { ScreenTable, GeneratorsConfig } from '../types';

type GenerateProjectFsData = {
  tablesList: TableSchema,
  screens: ScreenTable[],
}

export const generateAllScreens = ({ tablesList, screens }: GenerateProjectFsData, config: GeneratorsConfig) => {
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

