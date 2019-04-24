// @flow

import * as R from 'ramda';
import { createSelector } from 'reselect';
import { APP_STATUS } from '../constants';

import type { Selector } from 'reselect';
import type { Application } from '../types';


export const getApplicationsList = (applicationsList: Application[]) => applicationsList || [];

export const getApplicationss: Selector<Application, any, Application[]> = createSelector(
  getApplicationsList,
  R.filter(({ name }) => name !== null),
);

export const getActiveApplications: Selector<Application[], any, Application[]> = createSelector(
  getApplicationss,
  R.filter(({ status }) => status === APP_STATUS.ACTIVE),
);

export const hasConnectedApplications: Selector<Application[], any, boolean> = createSelector(
  getActiveApplications,
  applications => applications.length > 0,
);

export const getApplication: Selector<Application[], any, Application | void> = createSelector(
  getApplicationsList,
  (_, id: string) => id,
  (applications, appId) => applications.find(({ id }) => id === appId),
);
