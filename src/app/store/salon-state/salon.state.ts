import { Injectable } from '@angular/core';
import { State, Action, StateContext, Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { SalonService } from '../../shared/components/modals/add-salon-modal/services/salon.service';
import { SalonStateModel } from './salon-modal';
import { AddSalon, GetMySalons, GetSalonById, GetSalons } from './salon-actions';
import { GetMySalonsGQL, GetSalonByIdGQL, GetSalonsGQL } from '../../../generated/graphql';
import { UserSelectors } from '../user-state/user.selector';
import { ResetProcedureDrafts, SaveProcedures } from '../procedure-state/procedure-actions';

@State<SalonStateModel>({
  name: 'salon',
  defaults: {
    items: [],
    mysalons: [],
    activeFilter: null,
    selectedSalon: null,
    loading: false,
    error: null,
  },
})
@Injectable()
export class SalonState {
  constructor(
    private salonService: SalonService,
    private getSalonsGQL: GetSalonsGQL,
    private getSalonByIdGQL: GetSalonByIdGQL,
    private getMySalonsGQL: GetMySalonsGQL,
    private store: Store,
  ) {}

 
@Action(AddSalon)
addSalon(ctx: StateContext<SalonStateModel>, { payload, pictures }: AddSalon) {
  ctx.patchState({ loading: true, error: null });

  return this.salonService.addSalon(payload, pictures).pipe(
    switchMap(res => this.resolveSalonId(res)),                       
    switchMap(salonId => ctx.dispatch(new SaveProcedures(salonId))),  
    switchMap(() => ctx.dispatch([
      new ResetProcedureDrafts(),
      new GetSalons(ctx.getState().activeFilter),                     
      new GetMySalons(),
    ])),
    tap(() => ctx.patchState({ loading: false })),
   
  );
}

@Action(GetSalons)
getSalons(ctx: StateContext<SalonStateModel>, action: GetSalons) {
  ctx.patchState({ loading: true });
  return this.getSalonsGQL
    .fetch({ where: action.where }, { fetchPolicy: 'network-only' })
    .pipe(
      tap(result => ctx.patchState({
        items: result.data?.getSalons ?? [],
        activeFilter: action.where ?? null,
        loading: false,
      })),
    );
}

  @Action(GetSalonById)
  getSalonById(ctx: StateContext<SalonStateModel>, action: GetSalonById) {
    ctx.patchState({ loading: true, error: null });
    return this.getSalonByIdGQL
      .fetch({ id: action.salonid }, { fetchPolicy: 'network-only' })
      .pipe(
        tap(result => {
          const salon = result.data?.getSalonById?.[0] ?? null;
          ctx.patchState({
            selectedSalon: salon,
            loading: false,
            error: salon ? null : 'salon not found',
          });
        }),
      );
  }

  @Action(GetMySalons)
  getMySalons(ctx: StateContext<SalonStateModel>) {
    const user = this.store.selectSnapshot(UserSelectors.getUser);
    if (!user?.id) return;

    ctx.patchState({ loading: true, error: null });
    return this.getMySalonsGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      tap(result => {
        ctx.patchState({
          mysalons: result.data?.getMySalons ?? [],
          loading: false,
          error: null,
        });
      }),
    );
  }

  /** Reads the id from the add-salon response; if missing, takes the newest of "my salons" */
  private resolveSalonId(res: any): Observable<number> {
    const id = Number(res?.id ?? res?.salonId ?? res?.data?.id ?? res);
    if (id) return of(id);

    return this.getMySalonsGQL.fetch({}, { fetchPolicy: 'network-only' }).pipe(
      map(r => {
        const ids = (r.data?.getMySalons ?? []).map((s: any) => Number(s.id)).filter(Boolean);
        if (!ids.length) throw new Error('Could not determine the new salon id');
        return Math.max(...ids);
      }),
    );
  }
}