import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalonPayload } from '../../../../../store/salon-state/salon-actions';
import { SalonType } from '../../../../../store/salon-state/salon-modal';
import { ProcedurePayload } from '../../../../../store/procedure-state/procedure-model';

@Injectable({ providedIn: 'root' })
export class ProcedureService {
  private addProcedureUrl = `/Salons/add-procedure`;

  constructor(private http: HttpClient) {}

    addProcedure(salonId: number, userId: number, p: ProcedurePayload): Observable<unknown> {
    const fd = new FormData();
    fd.append('userid', String(userId));
    fd.append('SalonId', String(salonId));
    fd.append('ProcedureType', p.procedureType);          
    p.masters.forEach(m => fd.append('Masters', m));
    p.finishedWorks.forEach(file => fd.append('FinishedWorks', file));

    return this.http.post(this.addProcedureUrl, fd);
  }
}