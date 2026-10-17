import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { Store } from '@ngxs/store';
import { filter, map, take } from 'rxjs';
import { UserSelectors } from '../../../store/user-state/user.selector';

export const guestGuard: CanActivateFn = () => {
   const store = inject(Store);
  const router = inject(Router);

  return store.select(UserSelectors.isLoading).pipe(
    filter(isLoading => !isLoading),
    take(1),
    map(() => {
      const isAuthenticated = store.selectSnapshot(UserSelectors.isAuthorized);
      
      if (isAuthenticated) {
        router.navigate(['/']); 
        return false;
      }

      return true;
    })
  );
}