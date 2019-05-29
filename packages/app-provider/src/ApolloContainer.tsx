import * as React from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { AuthClient, Authorizable, AuthState } from '@8base/utils';
import { ApolloContainerPassedProps } from './types';
import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

import { withAuth, WithAuthProps } from '@8base/auth';
const { EightBaseApolloClient } = require('@8base/apollo-client');



type ApolloContainerProps = ApolloContainerPassedProps & {
  withAuth: boolean,
  children: React.ReactNode,
}

type ApolloContainerHocProps = WithAuthProps & ApolloContainerProps;


const ApolloContainer: React.ComponentType<ApolloContainerProps> = withAuth(
  class ApolloContainer extends React.Component<ApolloContainerHocProps> {
    client: any;

    static defaultProps = {
      withAuth: true,
    }

    onIdTokenExpired = async () => {
      const {
        auth: {
          setAuthState,
          renewToken,
        },
      } = this.props;

      const { idToken } = await renewToken({});

      await setAuthState({ token: idToken });
    };

    onAuthError = async () => {
      const {
        auth: {
          purgeAuthState,
          logout,
        },
      } = this.props;

      await purgeAuthState();

      if (typeof logout === 'function') {
        await logout();
      }
    };

    getAuthState = () => {
      const {
        auth: {
          authState,
        },
      } = this.props;

      return authState;
    };

    createClient = R.memoizeWith(R.identity, (fragmentsSchema) => {
      const { withAuth } = this.props;

      const commonOptions = {
        uri: this.props.uri,
        onRequestSuccess: this.props.onRequestSuccess,
        onRequestError: this.props.onRequestError,
        extendLinks: this.props.extendLinks,
        cache: new InMemoryCache({ fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData: fragmentsSchema }) }),
      };

      const eightBaseApolloClientData = withAuth
        ? {
          ...commonOptions,
          getAuthState: this.getAuthState,
          onAuthError: this.onAuthError,
          withAuth: true,
        }
        : {
          ...commonOptions,
          withAuth: false,
        }

      return new EightBaseApolloClient(eightBaseApolloClientData);
    });

    renderContent = ({ loading, fragmentsSchema }: { loading: boolean, fragmentsSchema: Object | null }) => {
      if (loading) {
        return null;
      }

      this.client = this.createClient(fragmentsSchema);

      return (
        <ApolloProvider client={ this.client }>
          { this.props.children }
        </ApolloProvider>
      );
    };

    render() {
      const { uri } = this.props;

      return (
        <FragmentsSchemaContainer uri={ uri }>
          { this.renderContent }
        </FragmentsSchemaContainer>
      );
    }
  }
)

export { ApolloContainer };

