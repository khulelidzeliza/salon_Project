import { Component, inject } from '@angular/core';
import { CatalogFilters } from '../../catalog/components/filter-bar/filter-bar/filter-bar.component';
import { CommonModule } from '@angular/common';
import { MysalonCardComponent } from "./mysalon-card/mysalon-card.component";
import { Store } from '@ngxs/store';
import { SalonSelectors } from '../../../store/salon-state/salon-selector';
import { GetMySalons } from '../../../store/salon-state/salon-actions';
import { Observable } from 'rxjs';
import { MySalons } from '../../../store/salon-state/salon-modal';

@Component({
  selector: 'app-user-salons',
  imports: [CommonModule, MysalonCardComponent],
  templateUrl: './user-salons.component.html',
  styleUrl: './user-salons.component.scss'
})
export default class UserSalonsComponent {
  private store = inject(Store);

  salons$ : Observable<MySalons[]> = this.store.select(SalonSelectors.mySalons);
  loading$ = this.store.select(SalonSelectors.loading);

  ngOnInit(): void {
    this.store.dispatch(new GetMySalons());
  }



  onFiltersChange(filters: CatalogFilters): void {
    console.log('filters changed', filters);
  }

  onToggleFavorite(salonId: number): void {
    console.log('toggle favorite', salonId);
  }
}
