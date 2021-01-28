import { createSelector, ParametricSelector } from 'reselect';
import { APP_STATUS } from '../constants';

import { Application } from '../types';

export const getApplicationsList: ParametricSelector<Application[], any, Application[]> = (
  applicationsList: Application[],
) => applicationsList || [];

export const getApplications: ParametricSelector<Application[], any, Application[]> = createSelector(
  getApplicationsList,
  applications => applications.filter(({ name }) => name !== null),
);

export const getActiveApplications: ParametricSelector<Application[], any, Application[]> = createSelector(
  getApplications,
  applications => applications.filter(({ status }) => status === APP_STATUS.ACTIVE),
);

export const hasConnectedApplications: ParametricSelector<Application[], any, boolean> = createSelector(
  getActiveApplications,
  applications => applications.length > 0,
);

export const getApplication: ParametricSelector<Application[], any, Application | void> = createSelector(
  getApplicationsList,
  (_: any, id: string) => id,
  (applications, appId) => applications.find(({ id }) => id === appId),
);
