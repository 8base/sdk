import { ApolloLink } from 'apollo-link';
import { AuthState } from '@8base/utils';

export type ApolloContainerPassedProps = {
  uri: string;
  autoSignUp?: boolean;
  authProfileId?: string;
  onRequestSuccess: (request: { [key: string]: any }) => void;
  onRequestError: (request: { [key: string]: any }) => void;
  extendLinks?: (
    links: ApolloLink[],
    options: { getAuthState?: () => Promise<AuthState> },
  ) => ApolloLink[];
};
