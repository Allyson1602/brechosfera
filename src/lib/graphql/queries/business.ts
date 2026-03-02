import { gql } from "@apollo/client";

export const GET_LOCAL_BAAZARS = gql`
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

export const GET_ONLINE_BAAZARS = gql`
  query GetOnlineBaazars {
    findAllOnlineBaazars {
      id
      name
      logoImage
      averagePrice
      evaluations
      isOnline
      address
      description
      images
      linkInstagram
      linkWhatsapp
      openingHours
      itemsType
      locationMap {
        id
        latitude
        longitude
      }
    }
  }
`;
