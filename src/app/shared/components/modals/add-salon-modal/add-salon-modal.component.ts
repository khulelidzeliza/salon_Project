import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ProcedureType } from '../../../../../generated/graphql';
import { SalonSelectors } from '../../../../store/salon-state/salon-selector';
import { Store } from '@ngxs/store';
import { AddSalon, ProcedurePayload, SalonPayload } from '../../../../store/salon-state/salon-actions';
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

  readonly procedureTypes: { value: ProcedureType; label: string }[] = [
    { value: 'HAIR', label: 'Hair' },
    { value: 'NAIL', label: 'Nails' },
    { value: 'BARBER', label: 'Barber' },
    { value: 'COSMETIC', label: 'Cosmetic' },
    { value: 'LASER', label: 'Laser' },
    { value: 'TATTOO', label: 'Tattoo' },
  ];

  procedures: (ProcedurePayload & { masterDraft: string })[] = [];

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

  // ── Procedures ──
  addProcedure(): void {
    const used = new Set(this.procedures.map(p => p.procedureType));
    const next = this.procedureTypes.find(t => !used.has(t.value))?.value ?? 'HAIR';
    this.procedures.push({ procedureType: next, masters: [], finishedWorks: [], masterDraft: '' });
  }

  removeProcedure(i: number): void {
    this.procedures.splice(i, 1);
  }

  setType(i: number, type: ProcedureType): void {
    this.procedures[i].procedureType = type;
  }

  addMaster(i: number, event?: Event): void {
    event?.preventDefault();
    const p = this.procedures[i];
    const name = p.masterDraft.trim();
    if (name && !p.masters.includes(name)) p.masters.push(name);
    p.masterDraft = '';
  }

  onMasterInput(i: number, event: Event): void {
    this.procedures[i].masterDraft = (event.target as HTMLInputElement).value;
  }

  removeMaster(i: number, m: number): void {
    this.procedures[i].masters.splice(m, 1);
  }

  onWorksChange(i: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    this.procedures[i].finishedWorks = input.files ? Array.from(input.files) : [];
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue() as SalonPayload;

    const procedures: ProcedurePayload[] = this.procedures.map(({ masterDraft, ...p }) => ({
      ...p,
      masters: masterDraft.trim() && !p.masters.includes(masterDraft.trim()) ? [...p.masters, masterDraft.trim()] : p.masters,
    }));

    this.store.dispatch(new AddSalon(payload, this.pictures, procedures)).subscribe({
      next: () => {
        const salons = this.store.selectSnapshot(SalonSelectors.salons);
        const salon = salons[salons.length - 1];   // the one just added

        this.form.reset();
        this.pictures = [];
        this.procedures = [];
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