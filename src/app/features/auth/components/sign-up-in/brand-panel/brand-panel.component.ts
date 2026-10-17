import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
RouterLink
@Component({
  selector: 'app-brand-panel',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './brand-panel.component.html',
  styleUrl: './brand-panel.component.scss',
})
export default class BrandPanelComponent {
  readonly services = ['Cut & Colour', 'Facials', 'Brows & Lash', 'Manicure', 'Bridal'];
}
