import { gql } from "@apollo/client";

export const AUTH_USER_FIELDS = gql`
  fragment AuthUserFields on User {
    id
    name
    email
    role
  }
`;

export const ME_QUERY = gql`
  query Me {
    me {
      ...AuthUserFields
    }
  }
  ${AUTH_USER_FIELDS}
`;

export const LOGIN_MUTATION = gql`
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      success
      message
      user {
        ...AuthUserFields
      }
    }
  }
  ${AUTH_USER_FIELDS}
`;

export const REGISTER_MUTATION = gql`
  mutation Register($registerInput: RegisterInput!) {
    register(registerInput: $registerInput) {
      success
      message
      user {
        ...AuthUserFields
      }
    }
  }
  ${AUTH_USER_FIELDS}
`;

export const REQUEST_EMAIL_VERIFICATION_CODE_MUTATION = gql`
  mutation RequestEmailVerificationCode($email: String!) {
    requestEmailVerificationCode(email: $email) {
      success
      message
    }
  }
`;

export const LOGOUT_MUTATION = gql`
  mutation Logout {
    logout {
      success
      message
    }
  }
`;

export const REFRESH_SESSION_MUTATION = gql`
  mutation RefreshSession {
    refreshSession {
      success
      message
      user {
        ...AuthUserFields
      }
    }
  }
  ${AUTH_USER_FIELDS}
`;

export const REQUEST_ACCOUNT_UPDATE_VERIFICATION_CODE_MUTATION = gql`
  mutation RequestAccountUpdateVerificationCode(
    $input: RequestAccountUpdateVerificationCodeInput!
  ) {
    requestAccountUpdateVerificationCode(input: $input) {
      success
      message
    }
  }
`;

export const UPDATE_ACCOUNT_MUTATION = gql`
  mutation UpdateAccount($input: UpdateAccountInput!) {
    updateAccount(input: $input) {
      success
      message
      user {
        ...AuthUserFields
      }
    }
  }
  ${AUTH_USER_FIELDS}
`;

export const DELETE_ACCOUNT_MUTATION = gql`
  mutation DeleteAccount($input: DeleteAccountInput!) {
    deleteAccount(input: $input) {
      success
      message
    }
  }
`;
