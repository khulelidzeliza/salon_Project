import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { SalonCardComponent } from '../../components/salon-card/salon-card/salon-card.component';
import { CatalogFilters, FilterBarComponent } from '../../components/filter-bar/filter-bar/filter-bar.component';
import { GetSalonsGQL, SalonFilterInput } from '../../../../../generated/graphql';
import { GetMySalons, GetSalons } from '../../../../store/salon-state/salon-actions';
import { Store } from '@ngxs/store';
import { SalonSelectors } from '../../../../store/salon-state/salon-selector';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, SalonCardComponent, FilterBarComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {

  private readonly store = inject(Store);

  salons$     = this.store.select(SalonSelectors.items);
  loading$    = this.store.select(SalonSelectors.loading);
  totalCount$ = this.salons$.pipe(map(s => s.length));

  ngOnInit() {
    this.store.dispatch([new GetSalons(), new GetMySalons()]);

  }
  onFiltersChange(filters: CatalogFilters): void {
    this.store.dispatch(new GetSalons(this.buildWhere(filters)));
  }


  private buildWhere(filters: CatalogFilters): SalonFilterInput | null {
    const conditions: SalonFilterInput[] = [];

    if (filters.search.trim()) {
      const term = filters.search.trim();
      conditions.push({
        or: [
          { name: { contains: term } },
          { location: { contains: term } },
        ]
      });
    }

    if (filters.price) {
      conditions.push({ price: { eq: filters.price } });
    }

    if (filters.category) {
      conditions.push({
        procedures: {
          some: { procedureType: { eq: filters.category } }
        }
      });
    }

    if (conditions.length === 0) return null;
    if (conditions.length === 1) return conditions[0];
    return { and: conditions };
  }

  onToggleFavorite(salonId: number): void {
    // TODO: REST call to favorite/unfavorite endpoint
    console.log('toggle favorite', salonId);
  }
}
