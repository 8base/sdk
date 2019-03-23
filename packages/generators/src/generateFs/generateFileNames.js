// @flow
import changeCase from 'change-case';

export const getCreateFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}CreateDialog.js`;
export const getEditFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}EditDialog.js`;
export const getDeleteFormFileName = (screenName: string) => `${changeCase.pascal(screenName)}DeleteDialog.js`;
export const getTableFileName = (screenName: string) => `${changeCase.pascal(screenName)}Table.js`;
export const getScreenFolderName = (screenName: string) => changeCase.camel(screenName);
