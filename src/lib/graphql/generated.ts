export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  message?: Maybe<Scalars['String']['output']>;
  success: Scalars['Boolean']['output'];
  user?: Maybe<User>;
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
  isPublished: Scalars['Boolean']['output'];
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
  address?: InputMaybe<Scalars['String']['input']>;
  averagePrice?: InputMaybe<Scalars['Float']['input']>;
  averageQuantity?: InputMaybe<Scalars['Float']['input']>;
  description: Scalars['String']['input'];
  evaluations?: InputMaybe<Array<Scalars['Float']['input']>>;
  images: Array<Scalars['String']['input']>;
  isAcceptExchange?: InputMaybe<Scalars['Boolean']['input']>;
  isOnline: Scalars['Boolean']['input'];
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  itemRenewal?: InputMaybe<BaazarItemRenewalType>;
  itemsType: Array<BaazarItemType>;
  linkInstagram?: InputMaybe<Array<Scalars['String']['input']>>;
  linkWhatsapp?: InputMaybe<Array<Scalars['String']['input']>>;
  locationMap?: InputMaybe<CreateLocationMapInput>;
  logoImage: Scalars['String']['input'];
  name: Scalars['String']['input'];
  openingHours?: InputMaybe<Array<Scalars['String']['input']>>;
  responsiblePerson?: InputMaybe<Scalars['String']['input']>;
  storeSize?: InputMaybe<BaazarStoreSizeType>;
};

export type CreateEventInput = {
  address?: InputMaybe<EventAddressInput>;
  businessId?: InputMaybe<Scalars['Int']['input']>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description: Scalars['String']['input'];
  endDate: Scalars['String']['input'];
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  startDate: Scalars['String']['input'];
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title: Scalars['String']['input'];
};

export type CreateLocationMapInput = {
  /** latitude */
  latitude: Scalars['Float']['input'];
  /** longitude */
  longitude: Scalars['Float']['input'];
};

export type Event = {
  __typename?: 'Event';
  address?: Maybe<EventAddress>;
  business?: Maybe<Baazar>;
  businessId?: Maybe<Scalars['ID']['output']>;
  coverImage: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  description: Scalars['String']['output'];
  endDate: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  isPublished: Scalars['Boolean']['output'];
  startDate: Scalars['String']['output'];
  tags: Array<Scalars['String']['output']>;
  title: Scalars['String']['output'];
};

export type EventAddress = {
  __typename?: 'EventAddress';
  city: Scalars['String']['output'];
  latitude: Scalars['Float']['output'];
  longitude: Scalars['Float']['output'];
  neighborhood: Scalars['String']['output'];
  number: Scalars['String']['output'];
  state: Scalars['String']['output'];
  street: Scalars['String']['output'];
  zipCode: Scalars['String']['output'];
};

export type EventAddressInput = {
  city: Scalars['String']['input'];
  latitude: Scalars['Float']['input'];
  longitude: Scalars['Float']['input'];
  neighborhood: Scalars['String']['input'];
  number: Scalars['String']['input'];
  state: Scalars['String']['input'];
  street: Scalars['String']['input'];
  zipCode: Scalars['String']['input'];
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

export type LoginInput = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBaazar: Baazar;
  createEvent: Event;
  createLocationMap: LocationMap;
  login: AuthPayload;
  logout: AuthPayload;
  refreshSession: AuthPayload;
  register: AuthPayload;
  removeBaazar: Baazar;
  removeEvent: Event;
  removeLocationMap: LocationMap;
  requestEmailVerificationCode: AuthPayload;
  updateBaazar: Baazar;
  updateEvent: Event;
  updateLocationMap: LocationMap;
};


export type MutationCreateBaazarArgs = {
  createBaazarInput: CreateBaazarInput;
};


export type MutationCreateEventArgs = {
  createEventInput: CreateEventInput;
};


export type MutationCreateLocationMapArgs = {
  createLocationMapInput: CreateLocationMapInput;
};


export type MutationLoginArgs = {
  loginInput: LoginInput;
};


export type MutationRegisterArgs = {
  registerInput: RegisterInput;
};


export type MutationRemoveBaazarArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveEventArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRemoveLocationMapArgs = {
  id: Scalars['Int']['input'];
};


export type MutationRequestEmailVerificationCodeArgs = {
  email: Scalars['String']['input'];
};


export type MutationUpdateBaazarArgs = {
  updateBaazarInput: UpdateBaazarInput;
};


export type MutationUpdateEventArgs = {
  updateEventInput: UpdateEventInput;
};


export type MutationUpdateLocationMapArgs = {
  updateLocationMapInput: UpdateLocationMapInput;
};

export type Query = {
  __typename?: 'Query';
  baazar: Baazar;
  event?: Maybe<Event>;
  findAllEvents: Array<Event>;
  findAllLocalBaazars: Array<Baazar>;
  findAllOnlineBaazars: Array<Baazar>;
  findBaazarsByName: Array<Baazar>;
  findOne: LocationMap;
  locations: Array<LocationMap>;
  me: User;
};


export type QueryBaazarArgs = {
  id: Scalars['Int']['input'];
};


export type QueryEventArgs = {
  id: Scalars['Int']['input'];
};


export type QueryFindBaazarsByNameArgs = {
  search: Scalars['String']['input'];
};


export type QueryFindOneArgs = {
  id: Scalars['Int']['input'];
};

export type RegisterInput = {
  email: Scalars['String']['input'];
  emailVerificationCode: Scalars['String']['input'];
  name: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
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

export type UpdateEventInput = {
  address?: InputMaybe<EventAddressInput>;
  businessId?: InputMaybe<Scalars['Int']['input']>;
  coverImage?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isPublished?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
  tags?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateLocationMapInput = {
  id: Scalars['Int']['input'];
  /** latitude */
  latitude?: InputMaybe<Scalars['Float']['input']>;
  /** longitude */
  longitude?: InputMaybe<Scalars['Float']['input']>;
};

export type User = {
  __typename?: 'User';
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  emailVerifiedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  role: UserRole;
  updatedAt: Scalars['DateTime']['output'];
};

export enum UserRole {
  Admin = 'ADMIN',
  BazaarOwner = 'BAZAAR_OWNER',
  Customer = 'CUSTOMER'
}

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

export type CreateBaazarMutationVariables = Exact<{
  createBaazarInput: CreateBaazarInput;
}>;


export type CreateBaazarMutation = { __typename?: 'Mutation', createBaazar: { __typename?: 'Baazar', id: string, name: string, isOnline: boolean, itemsType: Array<BaazarItemType>, address?: string | null, logoImage: string, linkWhatsapp: Array<string>, linkInstagram?: Array<string> | null, locationMap?: { __typename?: 'LocationMap', id: string, latitude: number, longitude: number } | null } };

export type UpdateBaazarMutationVariables = Exact<{
  updateBaazarInput: UpdateBaazarInput;
}>;


export type UpdateBaazarMutation = { __typename?: 'Mutation', updateBaazar: { __typename?: 'Baazar', id: string, name: string, isOnline: boolean, itemsType: Array<BaazarItemType>, address?: string | null, logoImage: string, linkWhatsapp: Array<string>, linkInstagram?: Array<string> | null } };

export type RemoveBaazarMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type RemoveBaazarMutation = { __typename?: 'Mutation', removeBaazar: { __typename?: 'Baazar', id: string } };

export type AuthUserFieldsFragment = { __typename?: 'User', id: string, name: string, email: string, role: UserRole };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'User', id: string, name: string, email: string, role: UserRole } };

export type LoginMutationVariables = Exact<{
  loginInput: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', success: boolean, message?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string, role: UserRole } | null } };

export type RegisterMutationVariables = Exact<{
  registerInput: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', success: boolean, message?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string, role: UserRole } | null } };

export type RequestEmailVerificationCodeMutationVariables = Exact<{
  email: Scalars['String']['input'];
}>;


export type RequestEmailVerificationCodeMutation = { __typename?: 'Mutation', requestEmailVerificationCode: { __typename?: 'AuthPayload', success: boolean, message?: string | null } };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: { __typename?: 'AuthPayload', success: boolean, message?: string | null } };

export type RefreshSessionMutationVariables = Exact<{ [key: string]: never; }>;


export type RefreshSessionMutation = { __typename?: 'Mutation', refreshSession: { __typename?: 'AuthPayload', success: boolean, message?: string | null, user?: { __typename?: 'User', id: string, name: string, email: string, role: UserRole } | null } };

export type GetLocalBaazarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetLocalBaazarsQuery = { __typename?: 'Query', findAllLocalBaazars: Array<{ __typename?: 'Baazar', id: string, name: string, logoImage: string, averagePrice: number, evaluations?: Array<number> | null, isOnline: boolean, address?: string | null, description?: string | null, images: Array<string>, isAcceptExchange: boolean, itemRenewal: BaazarItemRenewalType, linkInstagram?: Array<string> | null, linkWhatsapp: Array<string>, openingHours: Array<string>, itemsType: Array<BaazarItemType>, responsiblePerson: string, storeSize: BaazarStoreSizeType }> };

export type GetOnlineBaazarsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetOnlineBaazarsQuery = { __typename?: 'Query', findAllOnlineBaazars: Array<{ __typename?: 'Baazar', id: string, name: string, logoImage: string, averagePrice: number, evaluations?: Array<number> | null, isOnline: boolean, address?: string | null, description?: string | null, images: Array<string>, isAcceptExchange: boolean, itemRenewal: BaazarItemRenewalType, linkInstagram?: Array<string> | null, linkWhatsapp: Array<string>, openingHours: Array<string>, itemsType: Array<BaazarItemType>, responsiblePerson: string, storeSize: BaazarStoreSizeType }> };
