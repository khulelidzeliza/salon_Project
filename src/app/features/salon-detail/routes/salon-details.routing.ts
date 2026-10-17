import { Routes } from '@angular/router';

export const SALON_DETAILS_ROUTES: Routes = [
  {
    path: ':id',
    loadComponent: () =>
      import('../salon-page/salon-page.component').then(m => m.SalonPageComponent)
  }
];