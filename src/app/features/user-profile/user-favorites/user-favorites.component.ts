import { Component, computed, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { UserSelectors } from '../../../store/user-state/user.selector';

@Component({
  selector: 'app-user-favorites',
  imports: [],
  templateUrl: './user-favorites.component.html',
  styleUrl: './user-favorites.component.scss'
})
export default class UserFavoritesComponent {
  private readonly store = inject(Store);

  readonly user = this.store.selectSignal(UserSelectors.getUser);
  readonly favorites = computed(() => this.user()?.favorites ?? []);
}
