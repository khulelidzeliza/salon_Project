// app.component.ts — show header/footer on every page except auth.
// The salon-detail page now shares the global header (remove its hardcoded '/salons/9/' check).
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  template: `
    @if (!isAuthPage()) { <app-header></app-header> }
    <main><router-outlet></router-outlet></main>
    @if (!isAuthPage()) { <app-footer></app-footer> }
  `,
})
export class AppComponent {
  private router = inject(Router);
  readonly isAuthPage = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map(e => e.urlAfterRedirects.startsWith('/auth'))
    ),
    { initialValue: this.router.url.startsWith('/auth') }
  );
}
