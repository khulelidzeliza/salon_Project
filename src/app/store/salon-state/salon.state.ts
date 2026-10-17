import { Injectable } from '@angular/core';
import { State, Action,  StateContext, Store } from '@ngxs/store';
import { switchMap, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { SalonService } from '../../shared/components/modals/add-salon-modal/services/salon.service';
import { Salon, SalonStateModel } from './salon-modal';
import { AddSalon, GetMySalons, GetSalonById, GetSalons } from './salon-actions';
import { GetSalonsGQL } from '../../../generated/graphql';
import { GetSalonByIdGQL } from '../../../generated/graphql';
import { GetMySalonsGQL } from '../../../generated/graphql';
import { Observable } from '@apollo/client/utilities';
import { IUser } from '../user-state/user.model';
import { UserSelectors } from '../user-state/user.selector';

@State<SalonStateModel>({
  name: 'salon',
  defaults: {
    items: [],
    mysalons: [],
    activeFilter : null,
    selectedSalon: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class SalonState {
  static salons(state: SalonStateModel): Salon[] {
  return state.items;
}
  static loading(loading: any): import("rxjs").Observable<boolean> {
    throw new Error('Method not implemented.');
  }
  user!: Observable<IUser | null>;

  constructor(
    private salonService: SalonService,
    private GetSalonsGQL: GetSalonsGQL,
    private GetSalonByIdGQL: GetSalonByIdGQL,
    private GetMySalonsGQL: GetMySalonsGQL,
    private store: Store,

  ) { }

  @Action(AddSalon)
  addSalon(ctx: StateContext<SalonStateModel>, action: AddSalon) {
    ctx.patchState({ loading: true, error: null });

    const user = this.store.selectSnapshot(UserSelectors.getUser);

    return this.salonService.addSalon(action.payload, action.pictures).pipe(
      // then create every procedure for the new salon
      switchMap((salon: any) => {
        const salonId = Number(salon?.id ?? salon?.salonId ?? salon);
        if (!action.procedures.length || !salonId || !user?.id) return of(salon);
        return forkJoin(
          action.procedures.map(p => this.salonService.addProcedure(salonId, user.id, p))
        ).pipe(switchMap(() => of(salon)));
      }),
      tap({
        next: () => {
          ctx.patchState({ loading: false });
          ctx.dispatch([new GetSalons(), new GetMySalons()]);
        },
        error: () => ctx.patchState({ loading: false, error: 'Failed to create salon' }),
      }),
    );
  }

 @Action(GetSalons)
GetSalons(ctx: StateContext<SalonStateModel>, action: GetSalons) {
  ctx.patchState({ loading: true });
  return this.GetSalonsGQL
    .fetch({ where: action.where }, { fetchPolicy: 'network-only' })
    .pipe(
      tap((result) => {
        ctx.patchState({
          items: result.data?.getSalons ?? [],
          activeFilter: action.where ?? null,
          loading: false,
        });
      })
    );
}

  @Action(GetSalonById)
  GetSalonById(ctx: StateContext<SalonStateModel>, action: GetSalonById) {
    ctx.patchState({ loading: true, error: null });

    return this.GetSalonByIdGQL.fetch({ id: action.salonid }).pipe(
      tap((result) => {
        const data = result.data.getSalonById;
        const salon = data?.[0] ?? null
        if (!data) {
          ctx.patchState({
            selectedSalon: null,
            loading: false,
            error: 'salon not found'
          });
        }
        else {
          ctx.patchState({
            selectedSalon: salon,
            loading: false,
            error: null
          });
        }
      })
    );
  }

  @Action(GetMySalons)
  GetMySalons(ctx: StateContext<SalonStateModel>) {
    const user = this.store.selectSnapshot(UserSelectors.getUser);
    if (!user || !user.id) return;

    ctx.patchState({ loading: true, error: null });

    return this.GetMySalonsGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      tap((result) => {
        const data = result.data.getMySalons;
        ctx.patchState({
          mysalons: result.data?.getMySalons ?? [],
          loading: false,
          error: null
        });

      })
    );
  }

}