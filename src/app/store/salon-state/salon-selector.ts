import { Selector } from '@ngxs/store';
import { SalonState } from './salon.state';
import { MySalons, Salon, SalonDetail, SalonStateModel } from './salon-modal';

export class SalonSelectors {

  @Selector([SalonState])
  static items(state: SalonStateModel): Salon[] {
    return state.items;
  }
  @Selector([SalonState])
  static mySalons(state: SalonStateModel): MySalons[] {
    return state.mysalons;
  }

  @Selector([SalonState])
  static selectedSalon(state: SalonStateModel): SalonDetail | null {
    return state.selectedSalon;
  }
  @Selector([SalonState])
  static loading(state: SalonStateModel): boolean {
    return state.loading;
  }

  @Selector([SalonState])
  static error(state: SalonStateModel): unknown {
    return state.error;
  }

  @Selector([SalonState])
  static count(state: SalonStateModel): number {
    return state.items.length;
  }


}