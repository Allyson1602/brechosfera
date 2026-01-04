import { gql } from '@apollo/client';

export const GET_EVENTS = gql`
  query GetEvents($filters: EventFilterInput, $pagination: PaginationInput) {
    events(filters: $filters, pagination: $pagination) {
      id
      title
      description
      businessId
      business {
        id
        name
        coverImage
      }
      coverImage
      startDate
      endDate
      address {
        street
        number
        neighborhood
        city
        state
        latitude
        longitude
      }
      isOnline
      onlineUrl
      status
      tags
      createdAt
    }
  }
`;

export const GET_EVENT_BY_ID = gql`
  query GetEventById($id: ID!) {
    event(id: $id) {
      id
      title
      description
      businessId
      business {
        id
        name
        coverImage
        contact {
          phone
          whatsapp
          instagram
        }
      }
      coverImage
      images
      startDate
      endDate
      address {
        street
        number
        neighborhood
        city
        state
        zipCode
        latitude
        longitude
      }
      isOnline
      onlineUrl
      status
      tags
      createdAt
    }
  }
`;
