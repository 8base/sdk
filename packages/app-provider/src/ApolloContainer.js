import React from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import { EightBaseApolloClient } from '@8base/apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withAuth } from '@8base/auth';

import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

class ApolloContainer extends React.Component {
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

    if (authState) {
      return R.pick([
        'token',
        'workspaceId',
      ])(authState);
    }

    return null;
  };

  createClient = R.memoize((fragmentsSchema) => {
    return new EightBaseApolloClient({
      getAuthState: this.getAuthState,
      getRefreshTokenParameters: this.getRefreshTokenParameters,
      onAuthError: this.onAuthError,
      uri: this.props.uri,
      extendLinks: this.props.extendLinks,
      onRequestSuccess: this.props.onRequestSuccess,
      onRequestError: this.props.onRequestError,
      cache: new InMemoryCache({ fragmentMatcher: new IntrospectionFragmentMatcher({ introspectionQueryResultData: fragmentsSchema }) }),
    });
  });

  renderContent = ({ loading, fragmentsSchema }) => {
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

ApolloContainer = withAuth(ApolloContainer);

export { ApolloContainer };

