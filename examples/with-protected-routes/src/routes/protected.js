import React from 'react';
import { gql } from '@8base/react-sdk';
import { useQuery, useMutation, useSubscription } from 'react-apollo';

const CURRENT_USER_QUERY = gql`
  query CurrentUser {
    user {
      id
      email
      firstName
    }
  }
`;

const USER_UPDATE_MUTATION = gql`
  mutation UserUpdate($data: UserUpdateInput!, $filter: UserKeyFilter!) {
    userUpdate(data: $data, filter: $filter) {
      id
      email
      firstName
    }
  }
`;

const USER_SUBSCRIPTION = gql`
  subscription UserSubscription {
    Users {
      node {
        id
        email
        firstName
      }
      mutation
    }
  }
`;

export const Protected = () => {
  const { loading, data: userData } = useQuery(CURRENT_USER_QUERY);

  const [userUpdate] = useMutation(USER_UPDATE_MUTATION);

  const setRandomFirstName = async () => {
    userUpdate({
      variables: {
        data: {
          firstName: `${Math.random()}`,
        },
        filter: {
          id: userData.user.id,
        },
      }
    });
  };

  const subscription = useSubscription(USER_SUBSCRIPTION);

  console.log(subscription);

  return loading ? 'loading...' : (
    <div>
      Protected route, your email: {userData.user.email}, your first name: {userData.user.firstName}!
      <button onClick={setRandomFirstName}>Set random first name</button>
    </div>
  );
};