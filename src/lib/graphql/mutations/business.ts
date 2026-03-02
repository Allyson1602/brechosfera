import { gql } from "@apollo/client";

export const CREATE_BAAZAR = gql`
  mutation CreateBaazar($createBaazarInput: CreateBaazarInput!) {
    createBaazar(createBaazarInput: $createBaazarInput) {
      id
      name
      isOnline
      itemsType
      address
      logoImage
      linkWhatsapp
      linkInstagram
      locationMap {
        id
        latitude
        longitude
      }
    }
  }
`;

export const UPDATE_BAAZAR = gql`
  mutation UpdateBaazar($updateBaazarInput: UpdateBaazarInput!) {
    updateBaazar(updateBaazarInput: $updateBaazarInput) {
      id
      name
      isOnline
      itemsType
      address
      logoImage
      linkWhatsapp
      linkInstagram
    }
  }
`;

export const REMOVE_BAAZAR = gql`
  mutation RemoveBaazar($id: Int!) {
    removeBaazar(id: $id) {
      id
    }
  }
`;