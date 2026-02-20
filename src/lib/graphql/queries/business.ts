import { gql } from "@apollo/client";

export const GET_STORE_TESTE = gql`
  query GetLocalBaazars {
    findAllLocalBaazars {
      id
      name
      logoImage
      averagePrice
      evaluations
      isOnline
      evaluations
      address
      itemsType
      locationMap {
        id
        latitude
        longitude
      }
    }
  }
`;
