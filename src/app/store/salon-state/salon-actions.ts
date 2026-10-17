import { ProcedureType } from '../../../generated/graphql';
import { SalonFilterInput } from '../../../generated/graphql'; // adjust path to your actual generated file location

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

export type ProcedurePayload = {
  procedureType: ProcedureType;
  masters: string[];
  finishedWorks: File[];
};

export class AddSalon {
  static readonly type = '[Salon] Add Salon';
  constructor(
    public payload: SalonPayload,
    public pictures: File[],
    public procedures: ProcedurePayload[] = []
  ) {}
}

export class GetSalons {
  static readonly type = '[Salon] Get Salons';
  constructor(public where?: SalonFilterInput) {}
}

export class GetSalonById {
  static readonly type = '[Salon] Get Salon By Id';
  constructor(public salonid : number) {}
}

export class GetMySalons {
  static readonly type = '[Salon] Get Salons';
  constructor() {}
}