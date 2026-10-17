import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-card.component.html',
  styleUrl: './staff-card.component.scss'
})
export class StaffCardComponent {
  @Input({ required: true }) name!: string;

  get initials(): string {
    return this.name.split(' ').filter(Boolean).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  }
}