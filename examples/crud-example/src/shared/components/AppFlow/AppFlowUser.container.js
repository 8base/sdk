import React from 'react';
import { compose } from 'recompose';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { Dropdown, Menu, Avatar } from '@8base/boost';
import { withLogOut } from '@8base/auth';
import * as R from 'ramda';

const USER_QUERY = gql`
  query User {
    user {
      email
      firstName
      id
      lastName
      avatar {
        id
        url
      }
    }
  }
`;

class AppFlowUserContainer extends React.Component {
  renderContent = ({ data, loading }) => {
    if (loading) {
      return null;
    }

    return (
      <Dropdown.Plate defaultOpen={ false }>
        <Dropdown.Head>
          <Avatar src={ R.path(['user', 'avatar', 'url'], data) } size="sm" />
        </Dropdown.Head>
        <Dropdown.Body pin="right">
          {
            ({ closeDropdown }) => (
              <Menu.Plate>
                <Menu.Item onClick={ () => { this.props.logOut(); closeDropdown(); } }>Log Out</Menu.Item>
              </Menu.Plate>
            )
          }
        </Dropdown.Body>
      </Dropdown.Plate>
    );
  };

  render() {
    return <Query query={ USER_QUERY }>{ this.renderContent }</Query>;
  }
}

AppFlowUserContainer = compose(
  withLogOut,
)(AppFlowUserContainer);

export { AppFlowUserContainer };
