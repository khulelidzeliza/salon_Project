/** Internal type. DO NOT USE DIRECTLY. */
type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
/** Internal type. DO NOT USE DIRECTLY. */
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
import { gql } from 'apollo-angular';
import { Injectable } from '@angular/core';
import * as Apollo from 'apollo-angular';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: string; output: string; }
};

export type ApplyPolicy =
  | 'AFTER_RESOLVER'
  | 'BEFORE_RESOLVER'
  | 'VALIDATION';

export type BooleanOperationFilterInput = {
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  neq?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BudgetLevel =
  | 'CHEAP'
  | 'CHEAPEST'
  | 'EXPENSIVE'
  | 'MEDIUM'
  | 'MOST_EXPENSIVE';

export type BudgetLevelOperationFilterInput = {
  eq?: InputMaybe<BudgetLevel>;
  in?: InputMaybe<Array<BudgetLevel>>;
  neq?: InputMaybe<BudgetLevel>;
  nin?: InputMaybe<Array<BudgetLevel>>;
};

export type DateTimeOperationFilterInput = {
  eq?: InputMaybe<Scalars['DateTime']['input']>;
  gt?: InputMaybe<Scalars['DateTime']['input']>;
  gte?: InputMaybe<Scalars['DateTime']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  lt?: InputMaybe<Scalars['DateTime']['input']>;
  lte?: InputMaybe<Scalars['DateTime']['input']>;
  neq?: InputMaybe<Scalars['DateTime']['input']>;
  ngt?: InputMaybe<Scalars['DateTime']['input']>;
  ngte?: InputMaybe<Scalars['DateTime']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['DateTime']['input']>>>;
  nlt?: InputMaybe<Scalars['DateTime']['input']>;
  nlte?: InputMaybe<Scalars['DateTime']['input']>;
};

export type EmailFilterInput = {
  and?: InputMaybe<Array<EmailFilterInput>>;
  or?: InputMaybe<Array<EmailFilterInput>>;
  value?: InputMaybe<StringOperationFilterInput>;
};

export type EmailSortInput = {
  value?: InputMaybe<SortEnumType>;
};

export type EmailVerificationFilterInput = {
  and?: InputMaybe<Array<EmailVerificationFilterInput>>;
  attempts?: InputMaybe<IntOperationFilterInput>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  expiredAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<EmailVerificationFilterInput>>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type EmailVerificationSortInput = {
  attempts?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expiredAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Favorite = {
  __typename?: 'Favorite';
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  salon: Salon;
  salonId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
};

export type FavoriteFilterInput = {
  and?: InputMaybe<Array<FavoriteFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<FavoriteFilterInput>>;
  salon?: InputMaybe<SalonFilterInput>;
  salonId?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type Genders =
  | 'FEMALE'
  | 'MALE'
  | 'OTHER';

export type GendersOperationFilterInput = {
  eq?: InputMaybe<Genders>;
  in?: InputMaybe<Array<Genders>>;
  neq?: InputMaybe<Genders>;
  nin?: InputMaybe<Array<Genders>>;
};

export type IntOperationFilterInput = {
  eq?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  gte?: InputMaybe<Scalars['Int']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  lte?: InputMaybe<Scalars['Int']['input']>;
  neq?: InputMaybe<Scalars['Int']['input']>;
  ngt?: InputMaybe<Scalars['Int']['input']>;
  ngte?: InputMaybe<Scalars['Int']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  nlt?: InputMaybe<Scalars['Int']['input']>;
  nlte?: InputMaybe<Scalars['Int']['input']>;
};

export type ListFilterInputTypeOfFavoriteFilterInput = {
  all?: InputMaybe<FavoriteFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<FavoriteFilterInput>;
  some?: InputMaybe<FavoriteFilterInput>;
};

export type ListFilterInputTypeOfReviewFilterInput = {
  all?: InputMaybe<ReviewFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ReviewFilterInput>;
  some?: InputMaybe<ReviewFilterInput>;
};

export type ListFilterInputTypeOfSalonFilterInput = {
  all?: InputMaybe<SalonFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<SalonFilterInput>;
  some?: InputMaybe<SalonFilterInput>;
};

export type ListIntOperationFilterInput = {
  all?: InputMaybe<IntOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<IntOperationFilterInput>;
  some?: InputMaybe<IntOperationFilterInput>;
};

export type ListProcedureFilterTypeFilterInput = {
  all?: InputMaybe<ProcedureFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<ProcedureFilterInput>;
  some?: InputMaybe<ProcedureFilterInput>;
};

export type ListStringOperationFilterInput = {
  all?: InputMaybe<StringOperationFilterInput>;
  any?: InputMaybe<Scalars['Boolean']['input']>;
  none?: InputMaybe<StringOperationFilterInput>;
  some?: InputMaybe<StringOperationFilterInput>;
};

export type PasswordVerificationFilterInput = {
  and?: InputMaybe<Array<PasswordVerificationFilterInput>>;
  attempts?: InputMaybe<IntOperationFilterInput>;
  code?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  expiredAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<PasswordVerificationFilterInput>>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
};

export type PasswordVerificationSortInput = {
  attempts?: InputMaybe<SortEnumType>;
  code?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  expiredAt?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
};

export type Procedure = {
  __typename?: 'Procedure';
  createdAt: Scalars['DateTime']['output'];
  finishedWorks: Array<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  masters: Array<Scalars['String']['output']>;
  procedureType: ProcedureType;
  salon: Salon;
  salonId: Scalars['Int']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export type ProcedureFilterInput = {
  and?: InputMaybe<Array<ProcedureFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  finishedWorks?: InputMaybe<ListStringOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  masters?: InputMaybe<ListStringOperationFilterInput>;
  or?: InputMaybe<Array<ProcedureFilterInput>>;
  procedureType?: InputMaybe<ProcedureTypeOperationFilterInput>;
  salon?: InputMaybe<SalonFilterInput>;
  salonId?: InputMaybe<IntOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type ProcedureType =
  | 'BARBER'
  | 'COSMETIC'
  | 'HAIR'
  | 'LASER'
  | 'NAIL'
  | 'TATTOO';

export type ProcedureTypeOperationFilterInput = {
  eq?: InputMaybe<ProcedureType>;
  in?: InputMaybe<Array<ProcedureType>>;
  neq?: InputMaybe<ProcedureType>;
  nin?: InputMaybe<Array<ProcedureType>>;
};

export type Query = {
  __typename?: 'Query';
  getMySalons: Array<Salon>;
  getSalonById: Array<Salon>;
  getSalons: Array<Salon>;
  me: Array<User>;
};


export type QueryGetSalonByIdArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetSalonsArgs = {
  order?: InputMaybe<Array<SalonSortInput>>;
  where?: InputMaybe<SalonFilterInput>;
};

export type Review = {
  __typename?: 'Review';
  comment?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  id: Scalars['Int']['output'];
  star: Star;
  updatedAt: Scalars['DateTime']['output'];
};

export type ReviewFilterInput = {
  and?: InputMaybe<Array<ReviewFilterInput>>;
  comment?: InputMaybe<StringOperationFilterInput>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  or?: InputMaybe<Array<ReviewFilterInput>>;
  star?: InputMaybe<StarOperationFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
};

export type Roles =
  | 'ADMIN'
  | 'ORGANIZATOR'
  | 'USER';

export type RolesOperationFilterInput = {
  eq?: InputMaybe<Roles>;
  in?: InputMaybe<Array<Roles>>;
  neq?: InputMaybe<Roles>;
  nin?: InputMaybe<Array<Roles>>;
};

export type Salon = {
  __typename?: 'Salon';
  AverageRating?: Maybe<Scalars['Float']['output']>;
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  facebookLink?: Maybe<Scalars['String']['output']>;
  favorites: Array<Favorite>;
  id: Scalars['Int']['output'];
  instagramLink?: Maybe<Scalars['String']['output']>;
  isFavoritedByCurrentUser?: Maybe<Scalars['Boolean']['output']>;
  location: Scalars['String']['output'];
  name: Scalars['String']['output'];
  owner?: Maybe<User>;
  phoneNumber: Scalars['String']['output'];
  pictures: Array<Scalars['String']['output']>;
  price: BudgetLevel;
  procedures: Array<Procedure>;
  reviews: Array<Review>;
  updatedAt: Scalars['DateTime']['output'];
  user: User;
  userId: Scalars['Int']['output'];
  workingHours: Scalars['String']['output'];
};

export type SalonFilterInput = {
  and?: InputMaybe<Array<SalonFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<StringOperationFilterInput>;
  facebookLink?: InputMaybe<StringOperationFilterInput>;
  favorites?: InputMaybe<ListFilterInputTypeOfFavoriteFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  instagramLink?: InputMaybe<StringOperationFilterInput>;
  location?: InputMaybe<StringOperationFilterInput>;
  name?: InputMaybe<StringOperationFilterInput>;
  or?: InputMaybe<Array<SalonFilterInput>>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  pictures?: InputMaybe<ListStringOperationFilterInput>;
  price?: InputMaybe<BudgetLevelOperationFilterInput>;
  procedures?: InputMaybe<ListProcedureFilterTypeFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  user?: InputMaybe<UserFilterInput>;
  userId?: InputMaybe<IntOperationFilterInput>;
  workingHours?: InputMaybe<StringOperationFilterInput>;
};

export type SalonSortInput = {
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<SortEnumType>;
  facebookLink?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  instagramLink?: InputMaybe<SortEnumType>;
  location?: InputMaybe<SortEnumType>;
  name?: InputMaybe<SortEnumType>;
  phoneNumber?: InputMaybe<SortEnumType>;
  price?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  user?: InputMaybe<UserSortInput>;
  userId?: InputMaybe<SortEnumType>;
  workingHours?: InputMaybe<SortEnumType>;
};

export type SortEnumType =
  | 'ASC'
  | 'DESC';

export type Star =
  | 'FIVE'
  | 'FOUR'
  | 'ONE'
  | 'THREE'
  | 'TWO';

export type StarOperationFilterInput = {
  eq?: InputMaybe<Star>;
  in?: InputMaybe<Array<Star>>;
  neq?: InputMaybe<Star>;
  nin?: InputMaybe<Array<Star>>;
};

export type StringOperationFilterInput = {
  and?: InputMaybe<Array<StringOperationFilterInput>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  endsWith?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  in?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ncontains?: InputMaybe<Scalars['String']['input']>;
  nendsWith?: InputMaybe<Scalars['String']['input']>;
  neq?: InputMaybe<Scalars['String']['input']>;
  nin?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  nstartsWith?: InputMaybe<Scalars['String']['input']>;
  or?: InputMaybe<Array<StringOperationFilterInput>>;
  startsWith?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  age: Scalars['Int']['output'];
  createdAt: Scalars['DateTime']['output'];
  email: Scalars['String']['output'];
  favoritedSalons: Array<Scalars['Int']['output']>;
  favorites: Array<Favorite>;
  gender: Genders;
  id: Scalars['Int']['output'];
  isVerified: Scalars['Boolean']['output'];
  phoneNumber?: Maybe<Scalars['String']['output']>;
  reviews: Array<Review>;
  role: Roles;
  salons: Array<Salon>;
  updatedAt: Scalars['DateTime']['output'];
  userName: Scalars['String']['output'];
};

export type UserFilterInput = {
  age?: InputMaybe<IntOperationFilterInput>;
  and?: InputMaybe<Array<UserFilterInput>>;
  createdAt?: InputMaybe<DateTimeOperationFilterInput>;
  email?: InputMaybe<EmailFilterInput>;
  emailVerification?: InputMaybe<EmailVerificationFilterInput>;
  favoritedSalons?: InputMaybe<ListIntOperationFilterInput>;
  favorites?: InputMaybe<ListFilterInputTypeOfFavoriteFilterInput>;
  gender?: InputMaybe<GendersOperationFilterInput>;
  id?: InputMaybe<IntOperationFilterInput>;
  isVerified?: InputMaybe<BooleanOperationFilterInput>;
  or?: InputMaybe<Array<UserFilterInput>>;
  password?: InputMaybe<StringOperationFilterInput>;
  passwordEmailVerification?: InputMaybe<PasswordVerificationFilterInput>;
  phoneNumber?: InputMaybe<StringOperationFilterInput>;
  reviews?: InputMaybe<ListFilterInputTypeOfReviewFilterInput>;
  role?: InputMaybe<RolesOperationFilterInput>;
  salons?: InputMaybe<ListFilterInputTypeOfSalonFilterInput>;
  updatedAt?: InputMaybe<DateTimeOperationFilterInput>;
  userName?: InputMaybe<StringOperationFilterInput>;
};

export type UserSortInput = {
  age?: InputMaybe<SortEnumType>;
  createdAt?: InputMaybe<SortEnumType>;
  email?: InputMaybe<EmailSortInput>;
  emailVerification?: InputMaybe<EmailVerificationSortInput>;
  gender?: InputMaybe<SortEnumType>;
  id?: InputMaybe<SortEnumType>;
  isVerified?: InputMaybe<SortEnumType>;
  password?: InputMaybe<SortEnumType>;
  passwordEmailVerification?: InputMaybe<PasswordVerificationSortInput>;
  phoneNumber?: InputMaybe<SortEnumType>;
  role?: InputMaybe<SortEnumType>;
  updatedAt?: InputMaybe<SortEnumType>;
  userName?: InputMaybe<SortEnumType>;
};

export type GetSalonByIdQueryVariables = Exact<{
  id: number;
}>;


export type GetSalonByIdQuery = { getSalonById: Array<{ id: number, name: string, email: string, location: string, phoneNumber: string, workingHours: string, facebookLink: string | null, instagramLink: string | null, isFavoritedByCurrentUser: boolean | null, pictures: Array<string>, price: BudgetLevel, AverageRating: number | null, userId: number, procedures: Array<{ id: number, salonId: number, masters: Array<string>, procedureType: ProcedureType, finishedWorks: Array<string> }> }> };

export type GetSalonsQueryVariables = Exact<{
  where?: SalonFilterInput | null | undefined;
}>;


export type GetSalonsQuery = { getSalons: Array<{ id: number, name: string, location: string, pictures: Array<string>, facebookLink: string | null, instagramLink: string | null, userId: number, isFavoritedByCurrentUser: boolean | null, phoneNumber: string, price: BudgetLevel, AverageRating: number | null }> };

export type GetMySalonsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetMySalonsQuery = { getMySalons: Array<{ id: number, userId: number, pictures: Array<string>, price: BudgetLevel, name: string, location: string }> };

export type GetUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetUserQuery = { me: Array<{ id: number, userName: string, email: string, role: Roles, phoneNumber: string | null, createdAt: string, updatedAt: string, favorites: Array<{ id: number, userId: number, salonId: number, salon: { id: number, name: string, pictures: Array<string>, location: string } }>, salons: Array<{ id: number, name: string, isFavoritedByCurrentUser: boolean | null, pictures: Array<string> }>, reviews: Array<{ id: number, star: Star, createdAt: string, comment: string | null }> }> };

export const GetSalonByIdDocument = gql`
    query getSalonById($id: Int!) {
  getSalonById(id: $id) {
    id
    name
    email
    location
    phoneNumber
    workingHours
    facebookLink
    instagramLink
    isFavoritedByCurrentUser
    pictures
    price
    AverageRating
    userId
    procedures {
      id
      salonId
      masters
      procedureType
      finishedWorks
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSalonByIdGQL extends Apollo.Query<GetSalonByIdQuery, GetSalonByIdQueryVariables> {
    document = GetSalonByIdDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetSalonsDocument = gql`
    query getSalons($where: SalonFilterInput) {
  getSalons(where: $where) {
    id
    name
    location
    pictures
    facebookLink
    instagramLink
    userId
    isFavoritedByCurrentUser
    phoneNumber
    price
    AverageRating
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetSalonsGQL extends Apollo.Query<GetSalonsQuery, GetSalonsQueryVariables> {
    static watch(arg0: { where: null; }) {
      throw new Error('Method not implemented.');
    }
    document = GetSalonsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetMySalonsDocument = gql`
    query getMySalons {
  getMySalons {
    id
    userId
    pictures
    price
    name
    location
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetMySalonsGQL extends Apollo.Query<GetMySalonsQuery, GetMySalonsQueryVariables> {
    document = GetMySalonsDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }
export const GetUserDocument = gql`
    query GetUser {
  me {
    id
    userName
    email
    role
    phoneNumber
    createdAt
    updatedAt
    favorites {
      id
      userId
      salonId
      salon {
        id
        name
        pictures
        location
      }
    }
    salons {
      id
      name
      isFavoritedByCurrentUser
      pictures
    }
    reviews {
      id
      star
      createdAt
      comment
    }
  }
}
    `;

  @Injectable({
    providedIn: 'root'
  })
  export class GetUserGQL extends Apollo.Query<GetUserQuery, GetUserQueryVariables> {
    document = GetUserDocument;
    
    constructor(apollo: Apollo.Apollo) {
      super(apollo);
    }
  }