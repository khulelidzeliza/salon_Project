import { GetMySalonsQuery, GetSalonByIdQuery, GetSalonsQuery } from "../../../generated/graphql";
import { SalonFilterInput } from '../../../generated/graphql'; // adjust path to your actual generated file location

export type Salon = GetSalonsQuery['getSalons'][number];
export type SalonDetail = GetSalonByIdQuery['getSalonById'][number];  // Add this
export type MySalons = GetMySalonsQuery['getMySalons'][number];

export interface SalonType {
  id: string;
  name: string;
  location: string;
  price: number;
  phoneNumber?: string;
  email?: string;
  facebookLink?: string;
  instagramLink?: string;
  workingHours?: string;
  pictureUrls?: string[]; // server returns URLs for the uploaded Pictures
  userId?: string;        // set server-side via GetUserId()
  createdAt?: string;
}

export interface SalonStateModel{
  items: Salon[];
  mysalons : MySalons[],
  activeFilter: SalonFilterInput | null; // add this
  selectedSalon: SalonDetail | null;
  loading: boolean;
  error : string | null
}