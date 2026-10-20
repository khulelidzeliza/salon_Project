import { SalonFilterInput } from '../../../generated/graphql';

export type SalonPayload = {
  name: string;
  location: string;
  phoneNumber?: string;
  email?: string;
  price: number;
  facebookLink?: string;
  instagramLink?: string;
  workingHours?: string;
};

export class AddSalon {
  static readonly type = '[Salon] Add Salon';
  constructor(
    public payload: SalonPayload,
    public pictures: File[],
  ) {}
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