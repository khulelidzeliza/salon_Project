import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { map } from 'rxjs/operators';
import { SalonCardComponent } from '../../components/salon-card/salon-card/salon-card.component';
import { CatalogFilters, FilterBarComponent } from '../../components/filter-bar/filter-bar/filter-bar.component';
import { GetSalonsGQL, SalonFilterInput } from '../../../../../generated/graphql';
import { GetMySalons, GetSalons } from '../../../../store/salon-state/salon-actions';
import { Store } from '@ngxs/store';

@Component({
  selector: 'app-catalog-page',
  standalone: true,
  imports: [CommonModule, SalonCardComponent, FilterBarComponent],
  templateUrl: './catalog-page.component.html',
  styleUrl: './catalog-page.component.scss'
})
export class CatalogPageComponent {
  private getSalonsGQL = inject(GetSalonsGQL);
  private query = this.getSalonsGQL.watch({ where: null });

  salons$  = this.query.valueChanges.pipe(map(r => r.data?.getSalons ?? []));
  loading$ = this.query.valueChanges.pipe(map(r => r.loading));
  totalCount$ = this.salons$.pipe(map(s => s.length));
private readonly store = inject(Store);

  ngOnInit() {
  this.store.dispatch([new GetSalons(), new GetMySalons()]); // or just the one that page needs
}
  onFiltersChange(filters: CatalogFilters): void {
    const where = this.buildWhere(filters);
    this.query.refetch({ where });
  }


  private buildWhere(filters: CatalogFilters): SalonFilterInput | null {
    const conditions: SalonFilterInput[] = [];

    if (filters.search.trim()) {
      const term = filters.search.trim();
      conditions.push({
        or: [
          { name:     { contains: term } },
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
