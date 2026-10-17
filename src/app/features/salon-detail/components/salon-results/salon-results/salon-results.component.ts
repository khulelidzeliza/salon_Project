import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingResultsComponent, WorkingResultProcedure } from '../../working-results/working-results/working-results.component';

@Component({
  selector: 'app-salon-results',
  standalone: true,
  imports: [CommonModule, WorkingResultsComponent],
  templateUrl: './salon-results.component.html',
  styleUrl: './salon-results.component.scss'
})
export class SalonResultsComponent {
  @Input() category: string | null = null;
  @Input() procedures: WorkingResultProcedure[] = [];
}
