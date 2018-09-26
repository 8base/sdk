import React from 'react';
import { compose } from 'recompose';
import { ApolloProvider } from 'react-apollo';
import { EightBaseApolloClient } from '@8base/apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withAuth } from '@8base/auth';
import * as R from 'ramda';

import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';

class ApolloContainer extends React.Component {
  getRefreshTokenParameters = () => {
    const { auth: { authState: { email, refreshToken }}} = this.props;

    return { email, refreshToken };
  };

  onAuthSuccess = ({ refreshToken, idToken }) => {
    const { auth: { setAuthState }} = this.props;

    setAuthState({
      idToken,
      refreshToken,
    });
  };

  onAuthError = () => {
    const { auth: { purgeAuthState }} = this.props;

    purgeAuthState();
  };

  getAuthState = () => {
    const { auth: { authState: { idToken, workspaceId }}} = this.props;

    return {
      idToken,
      workspaceId,
    };
  };

  createClient = R.memoize((fragmentsSchema) => {
    return new EightBaseApolloClient({
      getAuthState: this.getAuthState,
      getRefreshTokenParameters: this.getRefreshTokenParameters,
      onAuthSuccess: this.onAuthSuccess,
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
