import React from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import {
  InMemoryCache,
  IntrospectionFragmentMatcher,
} from 'apollo-cache-inmemory';
import { withAuth, WithAuthProps } from '@8base/react-auth';
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
      withSubscriptions: false,
    };
    public client: any;

    public createClient = R.memoizeWith(
      R.identity,
      introspectionQueryResultData => {
        const {
          withAuth,
          withSubscriptions,
          autoSignUp,
          authProfileId,
        } = this.props;

        const commonOptions = {
          cache: introspectionQueryResultData
            ? new InMemoryCache({
                fragmentMatcher: new IntrospectionFragmentMatcher({
                  introspectionQueryResultData,
                }),
              })
            : new InMemoryCache(),
          extendLinks: this.props.extendLinks,
          onRequestError: this.props.onRequestError,
          onRequestSuccess: this.props.onRequestSuccess,
          uri: this.props.uri,
          withSubscriptions,
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
      },
    );

    public onIdTokenExpired = async () => {
      const {
        auth: { authClient },
      } = this.props;

      const { idToken } = await authClient.checkSession({});

      authClient.setState({ token: idToken });
    };

    public onAuthError = async () => {
      const {
        auth: { authClient },
      } = this.props;

      await this.client.clearStore();

      authClient.batch(() => {
        authClient.purgeState();
        authClient.logout();
      });
    };

    public getAuthState = () => {
      const {
        auth: { authState },
      } = this.props;

      return authState;
    };

    public renderContent = ({
      loading,
      introspectionQueryResultData,
    }: {
      loading: boolean;
      introspectionQueryResultData: object | null;
    }) => {
      if (loading) {
        return null;
      }

      this.client = this.createClient(introspectionQueryResultData);

      return (
        <ApolloProvider client={this.client}>
          {this.props.children}
        </ApolloProvider>
      );
    };

    public render() {
      const { uri, introspectionQueryResultData } = this.props;

      if (introspectionQueryResultData !== undefined) {
        return this.renderContent({
          loading: false,
          introspectionQueryResultData,
        });
      }

      return (
        <FragmentsSchemaContainer uri={uri}>
          {this.renderContent}
        </FragmentsSchemaContainer>
      );
    }
  },
);

export { ApolloContainer };
