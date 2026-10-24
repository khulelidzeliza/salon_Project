import { SalonFilterInput } from '../../../generated/graphql';

export type SalonPayload = {
  englishName: string;
  georgianName: string;
  location: string;
  phoneNumber?: string;
  email?: string;
  description?: string;
  price: number;
  facebookLink?: string;
  instagramLink?: string;
  workingHours?: string;
};

export type UpdateSalonPayload = {
  salonId: number;
  userId: number;
  englishName: string;
  georgianName: string;
  location: string;
  price: number;
  email: string | null;
  phoneNumber: string | null;
  workingHours: string | null;
  facebookLink: string | null;
  instagramLink: string | null;
  description?: string | null;
};

export class AddSalon {
  static readonly type = '[Salon] Add Salon';
  constructor(
    public payload: SalonPayload,
    public pictures: File[],
  ) {}
}

export class UpdateSalon {
  static readonly type = '[Salon] Update Salon';
  constructor(public payload: UpdateSalonPayload) {}
}

export class DeleteSalon {
  static readonly type = '[Salon] Delete Salon';
  constructor(public salonId: number) {}
}

export class GetSalons {
  static readonly type = '[Salon] Get Salons';
  constructor(public where?: SalonFilterInput | null) {}
}

export class GetSalonById {
  static readonly type = '[Salon] Get Salon By Id';
  constructor(public salonid: number) {}
}

export class GetMySalons {
  static readonly type = '[Salon] Get My Salons';
}