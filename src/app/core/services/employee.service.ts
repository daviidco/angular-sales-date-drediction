import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/api.config';
import { Employee } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private apiService = inject(ApiService);

  private mockEmployees: Employee[] = [
    {
      id: 1,
      firstName: 'Nancy',
      lastName: 'Davolio',
      title: 'Sales Representative',
      fullName: 'Nancy Davolio'
    },
    {
      id: 2,
      firstName: 'Andrew',
      lastName: 'Fuller',
      title: 'Vice President, Sales',
      fullName: 'Andrew Fuller'
    },
    {
      id: 3,
      firstName: 'Janet',
      lastName: 'Leverling',
      title: 'Sales Representative',
      fullName: 'Janet Leverling'
    }
  ];

  getEmployees(): Observable<Employee[]> {
    // return this.apiService.get<Employee[]>(API_ENDPOINTS.EMPLOYEE);
    return of(this.mockEmployees); // Mock data for now
  }
}