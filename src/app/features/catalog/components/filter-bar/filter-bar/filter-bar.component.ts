import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SlidersHorizontal, X, Search, LucideAngularModule } from 'lucide-angular';
import { BudgetLevel, ProcedureType } from '../../../../../../generated/graphql';

export interface CatalogFilters {
  search: string;
  price: BudgetLevel | '';
  category: ProcedureType | '';
  audience: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './filter-bar.component.html',
  styleUrl: './filter-bar.component.scss'
})
export class FilterBarComponent {
  @Output() filtersChange = new EventEmitter<CatalogFilters>();

  readonly FilterIcon = SlidersHorizontal;
  readonly CloseIcon = X;
  readonly SearchIcon = Search;

  filtersOpen = false;

  filters: CatalogFilters = {
    search: '',
    price: '',
    category: '',
    audience: '',
  };

  readonly priceOptions: { label: string; value: BudgetLevel | '' }[] = [
    { label: 'Any price',    value: ''              },
    { label: 'Cheapest',     value: 'CHEAPEST'      },
    { label: 'Cheap',        value: 'CHEAP'         },
    { label: 'Medium',       value: 'MEDIUM'        },
    { label: 'Expensive',    value: 'EXPENSIVE'     },
    { label: 'Premium',      value: 'MOST_EXPENSIVE'},
  ];

  readonly categoryOptions: { label: string; value: ProcedureType | '' }[] = [
    { label: 'All',       value: ''         },
    { label: 'Hair',      value: 'HAIR'     },
    { label: 'Nails',     value: 'NAIL'     },
    { label: 'Barber',    value: 'BARBER'   },
    { label: 'Cosmetic',  value: 'COSMETIC' },
    { label: 'Laser',     value: 'LASER'    },
    { label: 'Tattoo',    value: 'TATTOO'   },
  ];

  onChange(): void {
    this.filtersChange.emit({ ...this.filters });
  }

  clearSearch(): void {
    this.filters.search = '';
    this.onChange();
  }

  closeFilters(): void {
    this.filtersOpen = false;
  }

  toggleFilters(): void {
    this.filtersOpen = !this.filtersOpen;
  }
}
