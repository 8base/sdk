import React from 'react';
import R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { withAuth, WithAuthProps } from '@8base/auth';
import { ApolloClient } from '@8base/apollo-client';

import { ApolloContainerPassedProps } from './types';
import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

type ApolloContainerProps = ApolloContainerPassedProps & {
  withAuth: boolean;
  children: React.ReactNode;
};

type ApolloContainerHocProps = WithAuthProps & ApolloContainerProps;

const ApolloContainer: React.ComponentType<ApolloContainerProps> = withAuth(
  class ApolloContainer extends React.Component<ApolloContainerHocProps> {
    public static defaultProps = {
      autoSignUp: false,
      withAuth: true,
    };
    public client: any;

    public createClient = R.memoizeWith(R.identity, fragmentsSchema => {
      const { withAuth, autoSignUp, authProfileId } = this.props;

      const commonOptions = {
        cache: new InMemoryCache({
          fragmentMatcher: new IntrospectionFragmentMatcher({
            introspectionQueryResultData: fragmentsSchema,
          }),
        }),
        extendLinks: this.props.extendLinks,
        onRequestError: this.props.onRequestError,
        onRequestSuccess: this.props.onRequestSuccess,
        uri: this.props.uri,
      };

      const apolloClientOptions = withAuth
        ? {
            ...commonOptions,
            authProfileId,
            autoSignUp,
            getAuthState: this.getAuthState,
            onAuthError: this.onAuthError,
            onIdTokenExpired: this.onIdTokenExpired,
            withAuth: true,
          }
        : {
            ...commonOptions,
            withAuth: false,
          };

      return new ApolloClient(apolloClientOptions);
    });

    public onIdTokenExpired = async () => {
      const {
        auth: { setAuthState, renewToken },
      } = this.props;

      const { idToken } = await renewToken({});

      await setAuthState({ token: idToken });
    };

    public onAuthError = async () => {
      const {
        auth: { purgeAuthState, logout },
      } = this.props;

      await purgeAuthState();

      if (typeof logout === 'function') {
        await logout();
      }
    };

    public getAuthState = async () => {
      const {
        auth: { authState },
      } = this.props;

      return authState;
    };

    public renderContent = ({
      loading,
      fragmentsSchema,
    }: {
      loading: boolean;
      fragmentsSchema: object | null;
    }) => {
      if (loading) {
        return null;
      }

      this.client = this.createClient(fragmentsSchema);

      return (
        <ApolloProvider client={this.client}>
          {this.props.children}
        </ApolloProvider>
      );
    };

    public render() {
      const { uri } = this.props;

      return (
        <FragmentsSchemaContainer uri={uri}>
          {this.renderContent}
        </FragmentsSchemaContainer>
      );
    }
  },
);

export { ApolloContainer };
