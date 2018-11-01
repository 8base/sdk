import React from 'react';
import * as R from 'ramda';
import { compose } from 'recompose';
import { ApolloProvider } from 'react-apollo';
import { EightBaseApolloClient } from '@8base/apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withAuth } from '@8base/auth';

import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

const getIdToken = R.path(['idToken']);

class ApolloContainer extends React.Component {
  onIdTokenExpired = () => {
    const {
      auth: {
        setAuthState,
        checkSession,
      },
    } = this.props;

    return checkSession({}).then((authResult) => {
      const idToken = getIdToken(authResult);

      setAuthState({ idToken });
    });
  };

  onAuthError = () => {
    const { auth: { logout }} = this.props;

    logout({
      returnTo: `${window.location.origin}/auth`,
    });
  };

  getAuthState = () => {
    const {
      auth: {
        authState,
      },
    } = this.props;

    if (authState) {
      return R.pick([
        'idToken',
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

ApolloContainer = compose(
  withAuth,
)(ApolloContainer);

export { ApolloContainer };
