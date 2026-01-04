import { gql } from '@apollo/client';

export const CREATE_BUSINESS = gql`
  mutation CreateBusiness($input: CreateBusinessInput!) {
    createBusiness(input: $input) {
      id
      name
      slug
      category
      createdAt
    }
  }
`;

export const UPDATE_BUSINESS = gql`
  mutation UpdateBusiness($id: ID!, $input: UpdateBusinessInput!) {
    updateBusiness(id: $id, input: $input) {
      id
      name
      slug
      updatedAt
    }
  }
`;

export const DELETE_BUSINESS = gql`
  mutation DeleteBusiness($id: ID!) {
    deleteBusiness(id: $id)
  }
`;
