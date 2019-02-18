import React from 'react';
import * as R from 'ramda';
import { ApolloProvider } from 'react-apollo';
import { EightBaseApolloClient } from '@8base/apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { withAuth } from '@8base/auth';

import { FragmentsSchemaContainer } from './FragmentsSchemaContainer';


class ApolloContainer extends React.Component {
  static defaultProps = {
    auth: {},
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

    if (authState) {
      return R.pick([
        'token',
        'workspaceId',
      ])(authState);
    }

    return null;
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

    return withAuth
      ? new EightBaseApolloClient({
        ...commonOptions,
        getAuthState: this.getAuthState,
        onAuthError: this.onAuthError,
        withAuth: true,
      })
      : new EightBaseApolloClient({
        ...commonOptions,
        withAuth: false,
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

