import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { GetMySalonsQuery } from '../../../../../generated/graphql';
import { env } from '../../../../../environments/environment';
import { ConfirmModalComponent } from "../../../../shared/components/modals/confirm-modal/confirm-modal.component";
import { Store } from '@ngxs/store';

type Salon = GetMySalonsQuery['getMySalons'][number];

@Component({
  selector: 'app-mysalon-card',
  standalone: true,
  // imports: [RouterLink],
  imports: [ConfirmModalComponent],
  templateUrl: './mysalon-card.component.html',
  styleUrl: './mysalon-card.component.scss',
})
export class MysalonCardComponent {
  serverUrl = env.SERVER_URL;

  @Input({ required: true }) salon!: Salon;
  @Output() edit = new EventEmitter<number>();
  @Output() remove = new EventEmitter<number>();

  private store = inject(Store);

  showDeleteConfirm = false;
  deleting = false;

  
  onEdit(): void {
      this.edit.emit(this.salon.id);
  }
  
  askDelete(): void {
    this.showDeleteConfirm = true;
  }

  onRemove(): void {
    // this.deleting = true;
    // this.store.dispatch(new DeleteSalon(this.salon.id)).subscribe({
    //   next: () => {
    //     this.deleting = false;
    //     this.showDeleteConfirm = false;
    //   },
    //   error: () => {
    //     this.deleting = false;
    //     // keep modal open so the user can retry, or show an error
    //   },
    // });

  }
}