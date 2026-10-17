import { GetUserQuery } from "../../../generated/graphql";

export type IUser = GetUserQuery['me'][0];

export interface IUserStore{
  error : string | null;
  user : IUser | null ;
  loading : boolean ;
}


export enum UserRole {
  User = 'USER',
  Organizator = 'ORGANIZATOR',
  Admin = 'ADMIN'
}