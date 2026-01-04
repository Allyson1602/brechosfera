import { gql } from '@apollo/client';

export const GET_BUSINESSES = gql`
  query GetBusinesses($filters: BusinessFilterInput, $pagination: PaginationInput) {
    businesses(filters: $filters, pagination: $pagination) {
      id
      name
      slug
      description
      category
      subcategory
      isOnline
      rating
      reviewCount
      coverImage
      images
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
      contact {
        phone
        whatsapp
        email
        website
        instagram
        facebook
      }
      operatingHours {
        dayOfWeek
        openTime
        closeTime
        isClosed
      }
      itemTypes
      tags
      createdAt
      updatedAt
    }
  }
`;

export const GET_BUSINESS_BY_ID = gql`
  query GetBusinessById($id: ID!) {
    business(id: $id) {
      id
      name
      slug
      description
      category
      subcategory
      isOnline
      rating
      reviewCount
      coverImage
      images
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
      contact {
        phone
        whatsapp
        email
        website
        instagram
        facebook
      }
      operatingHours {
        dayOfWeek
        openTime
        closeTime
        isClosed
      }
      itemTypes
      tags
      reviews {
        id
        userId
        userName
        rating
        comment
        createdAt
      }
      createdAt
      updatedAt
    }
  }
`;

export const GET_NEARBY_BUSINESSES = gql`
  query GetNearbyBusinesses($latitude: Float!, $longitude: Float!, $radiusKm: Float!, $category: String) {
    nearbyBusinesses(latitude: $latitude, longitude: $longitude, radiusKm: $radiusKm, category: $category) {
      id
      name
      slug
      description
      category
      isOnline
      rating
      reviewCount
      coverImage
      address {
        latitude
        longitude
        neighborhood
        city
      }
      itemTypes
    }
  }
`;
