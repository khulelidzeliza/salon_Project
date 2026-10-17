import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { map, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Store } from '@ngxs/store';
import { SalonHeroComponent } from '../components/salon-hero/salon-hero/salon-hero.component';
import { SalonServicesComponent } from '../components/salon-services/salon-services/salon-services.component';
import { SalonResultsComponent } from '../components/salon-results/salon-results/salon-results.component';
import { SalonMastersComponent } from '../components/salon-masters/salon-masters/salon-masters.component';
import { SalonContactComponent } from '../components/salon-contact/salon-contact/salon-contact.component';
import { SalonActionBarComponent } from '../components/salon-action-bar/salon-action-bar/salon-action-bar.component';
import { SalonSelectors } from '../../../store/salon-state/salon-selector';
import { GetSalonById } from '../../../store/salon-state/salon-actions';

@Component({
  selector: 'app-salon-page',
  standalone: true,
  imports: [
    CommonModule,
    SalonHeroComponent,
    SalonServicesComponent,
    SalonResultsComponent,
    SalonMastersComponent,
    SalonContactComponent,
    SalonActionBarComponent
  ],
  templateUrl: './salon-page.component.html',
  styleUrl: './salon-page.component.scss'
})
export class SalonPageComponent {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  private selectedType$ = new BehaviorSubject<string | null>(null);

  salon$ = this.route.paramMap.pipe(
    map(params => Number(params.get('id'))),
    tap(id => this.store.dispatch(new GetSalonById(id))),
    switchMap(() => this.store.select(SalonSelectors.selectedSalon))
  );

  loading$ = this.store.select(SalonSelectors.loading);

  categories$ = this.salon$.pipe(
    map(salon => Array.from(new Set((salon?.procedures ?? []).map(p => p.procedureType))))
  );

  private matchingProcedures$ = combineLatest([this.salon$, this.selectedType$]).pipe(
    map(([salon, selected]) => {
      const procedures = salon?.procedures ?? [];
      if (!procedures.length) return [];
      const type = selected ?? procedures[0].procedureType;
      return procedures.filter(p => p.procedureType === type);
    })
  );

  workingResultProcedures$ = this.matchingProcedures$;

  masters$ = this.matchingProcedures$.pipe(
    map(procedures => Array.from(new Set(procedures.flatMap(p => p.masters ?? []))))
  );

  activeCategory$ = this.selectedType$.asObservable();

  onSelectCategory(type: string): void {
    this.selectedType$.next(type);
  }
}