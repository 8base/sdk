import React from 'react';
import { ThemeProvider } from 'emotion-theming';
import { compose } from 'recompose';
import { BatchHttpLink } from 'apollo-link-batch-http';
import { withRouter, BrowserRouter } from 'react-router-dom';
import { TableSchemaProvider } from '@8base/table-schema-provider';
import { ApolloProvider } from '@8base/apollo-provider';
import { createApolloClient } from '@8base/create-apollo-client';
import { createAuthLink, fileUploadLink } from '@8base/apollo-links';
import { defaultTheme, resetGlobal, Loader } from '@8base/boost';
import { withAuth, AuthProvider } from '@8base/auth-provider';

import { DialogProvider } from 'shared/dialog';

resetGlobal();

class EnhancedProviders extends React.Component {
  constructor(props) {
    super(props);

    this.getClient = createApolloClient({
      links: [
        fileUploadLink,
        createAuthLink({
          getAuthState: this.getAuthState,
          getRefreshTokenParameters: this.getRefreshTokenParameters,
          onAuthSuccess: this.onAuthSuccess,
          onAuthError: this.onAuthError,
        }),
        new BatchHttpLink({ uri: process.env.REACT_APP_8BASE_API_URL }),
      ],
    });
  }

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
    const { auth: { setAuthState }, history } = this.props;

    setAuthState({
      accountId: '',
      email: '',
      userId: '',
      organizationId: '',
      idToken: '',
      refreshToken: '',
    });

    history.push('/log-in');
  };

  getAuthState = () => {
    const { auth: { authState: { idToken, organizationId, accountId }}} = this.props;

    return {
      idToken,
      organizationId,
      accountId,
    };
  };

  renderContent = ({ isLoading }) => {
    if (isLoading) {
      return <Loader />;
    }

    const { children } = this.props;

    return children;
  };

  render() {
    return (
      <ThemeProvider theme={ defaultTheme }>
        <ApolloProvider getClient={ this.getClient } uri={ process.env.REACT_APP_8BASE_API_URL }>
          { this.renderContent }
        </ApolloProvider>
      </ThemeProvider>
    );
  }
}

EnhancedProviders = compose(
  withAuth,
  withRouter,
)(EnhancedProviders);

const Providers = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <DialogProvider>
        <EnhancedProviders>
          <TableSchemaProvider>
            { ({ loading }) => loading ? <Loader /> : children }
          </TableSchemaProvider>
        </EnhancedProviders>
      </DialogProvider>
    </AuthProvider>
  </BrowserRouter>
);

export { Providers };
