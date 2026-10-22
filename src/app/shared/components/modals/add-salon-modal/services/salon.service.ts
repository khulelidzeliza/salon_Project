import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SalonPayload } from '../../../../../store/salon-state/salon-actions';
import { SalonType } from '../../../../../store/salon-state/salon-modal';

@Injectable({ providedIn: 'root' })
export class SalonService {
  private addSalonUrl = `/Salons/add-salon`;

  constructor(private http: HttpClient) {}

  addSalon(payload: SalonPayload, pictures: File[]): Observable<SalonType> {
    const fd = new FormData();
    fd.append('Name', payload.name);
    fd.append('Location', payload.location);
    fd.append('Price', String(payload.price));
    if (payload.phoneNumber)   fd.append('PhoneNumber', payload.phoneNumber);
    if (payload.email)         fd.append('Email', payload.email);
    if (payload.facebookLink)  fd.append('FacebookLink', payload.facebookLink);
    if (payload.instagramLink) fd.append('InstagramLink', payload.instagramLink);
    if (payload.workingHours)  fd.append('WorkingHours', payload.workingHours);
    pictures.forEach(file => fd.append('Pictures', file)); // multiple files, same key

    return this.http.post<SalonType>(this.addSalonUrl, fd);
  }

}