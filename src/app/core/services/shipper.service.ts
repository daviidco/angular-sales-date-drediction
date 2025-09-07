import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/api.config';
import { Shipper } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class ShipperService {
  private apiService = inject(ApiService);

  private mockShippers: Shipper[] = [
    {
      id: 1,
      companyName: 'Speedy Express',
      phone: '(503) 555-9831'
    },
    {
      id: 2,
      companyName: 'United Package',
      phone: '(503) 555-3199'
    },
    {
      id: 3,
      companyName: 'Federal Shipping',
      phone: '(503) 555-9931'
    }
  ];

  getShippers(): Observable<Shipper[]> {
    // return this.apiService.get<Shipper[]>(API_ENDPOINTS.SHIPPER);
    return of(this.mockShippers); // Mock data for now
  }
}