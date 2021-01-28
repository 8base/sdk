import { gql } from '@apollo/client';

export const SIGNUP_MUTATION = gql`
  mutation UserSignUpMutation($user: UserCreateInput!, $authProfileId: ID) {
    userSignUp(user: $user, authProfileId: $authProfileId) {
      id
    }
  }
`;
