import { GetMySalonsQuery, GetSalonByIdQuery, GetSalonsQuery, SalonFilterInput } from '../../../generated/graphql';

export type Salon = GetSalonsQuery['getSalons'][number];
export type SalonDetail = GetSalonByIdQuery['getSalonById'][number];
export type MySalons = GetMySalonsQuery['getMySalons'][number];

/** REST response of add-salon. .NET sends JSON in camelCase, so these are lowercase. */
export interface SalonType {
  id: string;
  georgianName: string;
  englishName: string;
  location: string;
  price: number;
  phoneNumber?: string;
  email?: string;
  description?: string;
  facebookLink?: string;
  instagramLink?: string;
  workingHours?: string;
  pictureUrls?: string[]; 
  userId?: string;        
  createdAt?: string;
}

export interface SalonStateModel {
  items: Salon[];
  mysalons: MySalons[];
  activeFilter: SalonFilterInput | null;
  selectedSalon: SalonDetail | null;
  loading: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}