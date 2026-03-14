import { ApolloClient, HttpLink, InMemoryCache, gql } from "@apollo/client";

export const API_BASE_URL = "http://localhost:3000";

export const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: `${API_BASE_URL}/graphql` }),
  cache: new InMemoryCache(),
});
