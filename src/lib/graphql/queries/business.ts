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
      address
      description
      images
      isAcceptExchange
      itemRenewal
      linkInstagram
      linkWhatsapp
      openingHours
      itemsType
      responsiblePerson
      storeSize
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
      isAcceptExchange
      itemRenewal
      linkInstagram
      linkWhatsapp
      openingHours
      itemsType
      responsiblePerson
      storeSize
    }
  }
`;
