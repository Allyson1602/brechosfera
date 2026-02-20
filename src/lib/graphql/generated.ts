import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Baazar = {
  __typename?: 'Baazar';
  address?: Maybe<Scalars['String']['output']>;
  averagePrice: Scalars['Float']['output'];
  averageQuantity: Scalars['Float']['output'];
  description?: Maybe<Scalars['String']['output']>;
  evaluations?: Maybe<Array<Scalars['Float']['output']>>;
  id: Scalars['ID']['output'];
  images: Array<Scalars['String']['output']>;
  isAcceptExchange: Scalars['Boolean']['output'];
  isOnline: Scalars['Boolean']['output'];
  itemRenewal: BaazarItemRenewalType;
  itemsType: Array<BaazarItemType>;
  linkInstagram?: Maybe<Array<Scalars['String']['output']>>;
  linkWhatsapp: Array<Scalars['String']['output']>;
  locationMap?: Maybe<LocationMap>;
  logoImage: Scalars['String']['output'];
  name: Scalars['String']['output'];
  openingHours: Array<Scalars['String']['output']>;
  responsiblePerson: Scalars['String']['output'];
  storeSize: BaazarStoreSizeType;
};

/** Tipos de itens disponíveis em um bazar */
export enum BaazarItemType {
  Accessories = 'ACCESSORIES',
  Bags = 'BAGS',
  Books = 'BOOKS',
  Childrenswear = 'CHILDRENSWEAR',
  CostumeJewelry = 'COSTUME_JEWELRY',
  Electronics = 'ELECTRONICS',
  Furniture = 'FURNITURE',
  HomeDecor = 'HOME_DECOR',
  Jewelry = 'JEWELRY',
  Kitchenware = 'KITCHENWARE',
  KnickKnacks = 'KNICK_KNACKS',
  Media = 'MEDIA',
  Menswear = 'MENSWEAR',
  PersonalCare = 'PERSONAL_CARE',
  Shoes = 'SHOES',
  ToolsAndEquipment = 'TOOLS_AND_EQUIPMENT',
  Toys = 'TOYS',
  Womenswear = 'WOMENSWEAR'
}

export type CreateBaazarInput = {
  address: Scalars['String']['input'];
  averagePrice: Scalars['Float']['input'];
  averageQuantity: Scalars['Float']['input'];
  description: Scalars['String']['input'];
  evaluations?: InputMaybe<Array<Scalars['Float']['input']>>;
  images: Array<Scalars['String']['input']>;
  isAcceptExchange: Scalars['Boolean']['input'];
  isOnline: Scalars['Boolean']['input'];
  itemRenewal: BaazarItemRenewalType;
  itemsType: Array<BaazarItemType>;
  linkInstagram?: InputMaybe<Array<Scalars['String']['input']>>;
  linkWhatsapp: Array<Scalars['String']['input']>;
  locationMap?: InputMaybe<CreateLocationMapInput>;
  logoImage: Scalars['String']['input'];
  name: Scalars['String']['input'];
  openingHours: Array<Scalars['String']['input']>;
  responsiblePerson: Scalars['String']['input'];
  storeSize: BaazarStoreSizeType;
};

export type CreateLocationMapInput = {
  /** latitude */
  latitude: Scalars['Float']['input'];
  /** longitude */
  longitude: Scalars['Float']['input'];
};

export type LocationMap = {
  __typename?: 'LocationMap';
  baazar?: Maybe<Baazar>;
  id: Scalars['ID']['output'];
  /** latitude */
  latitude: Scalars['Float']['output'];
  /** longitude */
  longitude: Scalars['Float']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBaazar: Baazar;
  createLocationMap: LocationMap;
  removeBaazar: Baazar;
  removeLocationMap: LocationMap;
  updateBaazar: Baazar;
  updateLocationMap: LocationMap;
};


export type MutationCreateBaazarArgs = {
  createBaazarInput: CreateBaazarInput;
};


export type MutationCreateLocationMapArgs = {
  createLocationMapInput: CreateLocationMapInput;
};


export type MutationRemoveBaazarArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveLocationMapArgs = {
  id: Scalars['Int']['input'];
};


export type MutationUpdateBaazarArgs = {
  updateBaazarInput: UpdateBaazarInput;
};


export type MutationUpdateLocationMapArgs = {
  updateLocationMapInput: UpdateLocationMapInput;
};

export type Query = {
  __typename?: 'Query';
  baazar: Baazar;
  findAllLocalBaazars: Array<Baazar>;
  findAllOnlineBaazars: Array<Baazar>;
  findOne: LocationMap;
  locations: Array<LocationMap>;
};


export type QueryBaazarArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindOneArgs = {
  id: Scalars['Int']['input'];
};

export type UpdateBaazarInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  averagePrice?: InputMaybe<Scalars['Float']['input']>;
  averageQuantity?: InputMaybe<Scalars['Float']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  evaluations?: InputMaybe<Array<Scalars['Float']['input']>>;
  id: Scalars['Int']['input'];
  images?: InputMaybe<Array<Scalars['String']['input']>>;
  isAcceptExchange?: InputMaybe<Scalars['Boolean']['input']>;
  isOnline?: InputMaybe<Scalars['Boolean']['input']>;
  itemRenewal?: InputMaybe<BaazarItemRenewalType>;
  itemsType?: InputMaybe<Array<BaazarItemType>>;
  linkInstagram?: InputMaybe<Array<Scalars['String']['input']>>;
  linkWhatsapp?: InputMaybe<Array<Scalars['String']['input']>>;
  locationMap?: InputMaybe<CreateLocationMapInput>;
  logoImage?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newEvaluation?: InputMaybe<Scalars['Int']['input']>;
  openingHours?: InputMaybe<Array<Scalars['String']['input']>>;
  responsiblePerson?: InputMaybe<Scalars['String']['input']>;
  storeSize?: InputMaybe<BaazarStoreSizeType>;
};

export type UpdateLocationMapInput = {
  id: Scalars['Int']['input'];
  /** latitude */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** longitude */
  longitude?: InputMaybe<Scalars['Float']['input']>;
};

/** Período de renovação de itens em um bazar */
export enum BaazarItemRenewalType {
  Annually = 'ANNUALLY',
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Quarterly = 'QUARTERLY',
  SemiAnnually = 'SEMI_ANNUALLY',
  Weekly = 'WEEKLY'
}

/** Tamanhos de bazares */
export enum BaazarStoreSizeType {
  Large = 'LARGE',
  Medium = 'MEDIUM',
  Small = 'SMALL'
}

export type GetLocalBaazarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocalBaazarsQuery = { __typename?: 'Query', findAllLocalBaazars: Array<{ __typename?: 'Baazar', id: string, name: string, logoImage: string, averagePrice: number, evaluations?: Array<number> | null, isOnline: boolean, address?: string | null, itemsType: Array<BaazarItemType>, locationMap?: { __typename?: 'LocationMap', id: string, latitude: number, longitude: number } | null }> };


export const GetLocalBaazarsDocument = gql`
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

/**
 * __useGetLocalBaazarsQuery__
 *
 * To run a query within a React component, call `useGetLocalBaazarsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetLocalBaazarsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetLocalBaazarsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetLocalBaazarsQuery(baseOptions?: Apollo.QueryHookOptions<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>(GetLocalBaazarsDocument, options);
      }
export function useGetLocalBaazarsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>(GetLocalBaazarsDocument, options);
        }
// @ts-ignore
export function useGetLocalBaazarsSuspenseQuery(baseOptions?: Apollo.SuspenseQueryHookOptions<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>;
export function useGetLocalBaazarsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>): Apollo.UseSuspenseQueryResult<GetLocalBaazarsQuery | undefined, GetLocalBaazarsQueryVariables>;
export function useGetLocalBaazarsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>(GetLocalBaazarsDocument, options);
        }
export type GetLocalBaazarsQueryHookResult = ReturnType<typeof useGetLocalBaazarsQuery>;
export type GetLocalBaazarsLazyQueryHookResult = ReturnType<typeof useGetLocalBaazarsLazyQuery>;
export type GetLocalBaazarsSuspenseQueryHookResult = ReturnType<typeof useGetLocalBaazarsSuspenseQuery>;
export type GetLocalBaazarsQueryResult = Apollo.QueryResult<GetLocalBaazarsQuery, GetLocalBaazarsQueryVariables>;