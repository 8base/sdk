import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { withModal } from '@8base/boost';

import { Clients } from '../components/Clients';

const CLIENTS_LIST_QUERY = gql`
  query ClientsList {
    clientsList {
      id
      createdAt
      updatedAt
      firstName
      lastName
      email
    }
  }
`;

class ClientsContainer extends React.Component {
  renderContent = ({ data, loading }) => {
    const { openModal } = this.props;

    return <Clients data={ data } loading={ loading } openModal={ openModal } />;
  };

  render() {
    return <Query query={ CLIENTS_LIST_QUERY }>{ this.renderContent }</Query>;
  }
}

ClientsContainer = withModal(ClientsContainer);

export { ClientsContainer };
