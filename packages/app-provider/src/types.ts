import { ApolloLink } from 'apollo-link';
import { IAuthState, TableSchema, Application } from '@8base/utils';

export type ApolloContainerPassedProps = {
  uri: string;
  autoSignUp?: boolean;
  withSubscriptions?: boolean;
  authProfileId?: string;
  onRequestSuccess: (request: { [key: string]: any }) => void;
  onRequestError: (request: { [key: string]: any }) => void;
  extendLinks?: (
    links: ApolloLink[],
    options: { getAuthState?: () => IAuthState },
  ) => ApolloLink[];
  introspectionQueryResultData?: Object;
  tablesList?: TableSchema[];
  applicationsList?: Application[];
};
