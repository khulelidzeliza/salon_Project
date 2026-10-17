import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServiceTabsComponent } from '../../service-tabs/service-tabs/service-tabs.component';

@Component({
  selector: 'app-salon-services',
  standalone: true,
  imports: [CommonModule, ServiceTabsComponent],
  templateUrl: './salon-services.component.html',
  styleUrl: './salon-services.component.scss'
})
export class SalonServicesComponent {
  @Input() categories: string[] = [];
  @Input() active: string | null = null;
  @Output() categorySelected = new EventEmitter<string>();
}
