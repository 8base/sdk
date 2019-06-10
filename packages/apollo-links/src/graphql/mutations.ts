import gql from 'graphql-tag';

export const SIGNUP_MUTATION = gql`
  mutation UserSignUpMutation($user: UserCreateInput!, $authProfileId: ID) {
    userSignUp(user: $user, authProfileId: $authProfileId) {
      id
    }
  }
`;
