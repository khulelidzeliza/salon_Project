import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { SalonSelectors } from '../../../../store/salon-state/salon-selector';
import { Store } from '@ngxs/store';
import { AddSalon, SalonPayload } from '../../../../store/salon-state/salon-actions';
import { SalonType } from '../../../../store/salon-state/salon-modal';
@Component({
  selector: 'app-add-salon-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-salon-modal.component.html',
  styleUrl: './add-salon-modal.component.scss',
})
export class AddSalonModalComponent {
  private readonly fb = inject(FormBuilder);
  private readonly store = inject(Store);

  loading$ = this.store.select(SalonSelectors.loading);
  error$ = this.store.select(SalonSelectors.error);
  pictures: File[] = [];

  @Input() open = false;
  @Output() closed = new EventEmitter<void>();
  @Output() created = new EventEmitter<SalonType>();

  form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    location: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(0)]],
    phoneNumber: [''],
    email: ['', Validators.email],
    facebookLink: [''],
    instagramLink: [''],
    workingHours: [''],
  });


  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pictures = input.files ? Array.from(input.files) : [];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as SalonPayload;

    this.store.dispatch(new AddSalon(payload, this.pictures)).subscribe({
      next: () => {
        const salons = this.store.selectSnapshot(SalonSelectors.salons);
        const salon = salons[salons.length - 1];   // the one just added

        this.form.reset();
        this.pictures = [];
        this.created.emit();
        this.close();
      },
      error: (err) => console.error('Add salon failed', err),
    });
  }
  close(): void {
    this.closed.emit();
  }
}