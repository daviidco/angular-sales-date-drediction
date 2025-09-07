import { Injectable, inject } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Customer, CustomerListItem, CustomerFilterCriteria, CustomerStatus } from '../../shared/models/customer';
import { ApiService, PaginationParams } from '../api/api.service';
import { API_ENDPOINTS } from '../api/api.config';
import { PaginatedResponse } from '../models/api-response.model';
import { Customer as ApiCustomer, SalesDatePrediction } from '../models/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiService = inject(ApiService);
  private mockCustomers: Customer[] = [
    {
      id: '1',
      name: 'Ana García López',
      email: 'ana.garcia@email.com',
      phone: '+34 612 345 678',
      lastOrderDate: new Date('2024-08-15'),
      nextPredictedOrderDate: new Date('2024-09-15'),
      totalOrders: 12,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2023-01-15')
    },
    {
      id: '2',
      name: 'Carlos Mendoza Silva',
      email: 'carlos.mendoza@email.com',
      phone: '+34 698 765 432',
      lastOrderDate: new Date('2024-07-20'),
      nextPredictedOrderDate: new Date('2024-10-10'),
      totalOrders: 8,
      status: CustomerStatus.AT_RISK,
      createdAt: new Date('2023-03-10')
    },
    {
      id: '3',
      name: 'María González Ruiz',
      email: 'maria.gonzalez@email.com',
      phone: '+34 655 123 789',
      lastOrderDate: new Date('2024-08-25'),
      nextPredictedOrderDate: new Date('2024-09-10'),
      totalOrders: 25,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2022-11-05')
    },
    {
      id: '4',
      name: 'José Luis Fernández',
      email: 'jose.fernandez@email.com',
      lastOrderDate: null,
      nextPredictedOrderDate: new Date('2024-09-20'),
      totalOrders: 0,
      status: CustomerStatus.NEW,
      createdAt: new Date('2024-08-01')
    },
    {
      id: '5',
      name: 'Laura Martínez Torres',
      email: 'laura.martinez@email.com',
      phone: '+34 687 456 123',
      lastOrderDate: new Date('2024-05-15'),
      nextPredictedOrderDate: null,
      totalOrders: 3,
      status: CustomerStatus.INACTIVE,
      createdAt: new Date('2023-12-01')
    },
    {
      id: '6',
      name: 'Roberto Sánchez Díaz',
      email: 'roberto.sanchez@email.com',
      phone: '+34 611 987 654',
      lastOrderDate: new Date('2024-08-30'),
      nextPredictedOrderDate: new Date('2024-09-08'),
      totalOrders: 18,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2022-08-20')
    },
    {
      id: '7',
      name: 'Carmen Rodríguez Vega',
      email: 'carmen.rodriguez@email.com',
      lastOrderDate: new Date('2024-06-10'),
      nextPredictedOrderDate: new Date('2024-09-25'),
      totalOrders: 5,
      status: CustomerStatus.AT_RISK,
      createdAt: new Date('2023-05-15')
    },
    {
      id: '8',
      name: 'Francisco Jiménez Moreno',
      email: 'francisco.jimenez@email.com',
      phone: '+34 666 333 111',
      lastOrderDate: new Date('2024-08-28'),
      nextPredictedOrderDate: new Date('2024-09-12'),
      totalOrders: 15,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date('2022-12-10')
    }
  ];

  // API Methods - Producción
  getCustomers(filterCriteria?: CustomerFilterCriteria): Observable<CustomerListItem[]> {
    // Usar endpoint de sales prediction para poblar la tabla principal
    return this.apiService.get<SalesDatePrediction[]>(API_ENDPOINTS.SALES_PREDICTION).pipe(
      map(predictions => this.transformSalesPredictionsToListItems(predictions)),
      map(customers => this.applyFilters(customers, filterCriteria))
    );
  }
  
  getCustomersPaginated(
    pagination?: PaginationParams,
    filterCriteria?: CustomerFilterCriteria
  ): Observable<PaginatedResponse<CustomerListItem>> {
    return this.apiService.getPaginated<CustomerListItem>(
      API_ENDPOINTS.CUSTOMER,
      pagination,
      { params: this.buildFilterParams(filterCriteria) }
    );
  }

  getCustomerById(id: string): Observable<Customer | null> {
    return this.apiService.getById<ApiCustomer>(API_ENDPOINTS.CUSTOMER, id).pipe(
      map(apiCustomer => apiCustomer ? this.transformApiCustomerToCustomer(apiCustomer) : null)
    );
  }

  getSalesPrediction(): Observable<SalesDatePrediction[]> {
    return this.apiService.get<SalesDatePrediction[]>(API_ENDPOINTS.SALES_PREDICTION);
  }
  
  createCustomer(customer: Omit<Customer, 'id' | 'createdAt'>): Observable<Customer> {
    return this.apiService.post<Customer>(API_ENDPOINTS.CUSTOMER, customer);
  }
  
  updateCustomer(id: string, customer: Partial<Customer>): Observable<Customer> {
    return this.apiService.putById<Customer>(API_ENDPOINTS.CUSTOMER, id, customer);
  }
  
  deleteCustomer(id: string): Observable<void> {
    return this.apiService.deleteById(API_ENDPOINTS.CUSTOMER, id);
  }
  
  // Método mock temporal
  private getMockCustomers(filterCriteria?: CustomerFilterCriteria): Observable<CustomerListItem[]> {
    return of(this.mockCustomers).pipe(
      delay(800),
      map(customers => this.transformToListItems(customers)),
      map(customers => this.applyFilters(customers, filterCriteria))
    );
  }

  private transformApiCustomersToListItems(apiCustomers: ApiCustomer[]): CustomerListItem[] {
    const today = new Date();
    
    return apiCustomers.map(apiCustomer => ({
      id: apiCustomer.id.toString(),
      name: apiCustomer.companyName,
      lastOrderDate: null, // Se obtendría de las órdenes o predicciones
      nextPredictedOrderDate: null, // Se obtendría del endpoint de predicciones
      daysSinceLastOrder: null,
      daysToNextOrder: null,
      status: CustomerStatus.ACTIVE // Por defecto, se podría calcular basado en última orden
    }));
  }

  private transformApiCustomerToCustomer(apiCustomer: ApiCustomer): Customer {
    return {
      id: apiCustomer.id.toString(),
      name: apiCustomer.companyName,
      email: '', // No disponible en API
      phone: apiCustomer.phone || '',
      lastOrderDate: null,
      nextPredictedOrderDate: null,
      totalOrders: 0,
      status: CustomerStatus.ACTIVE,
      createdAt: new Date()
    };
  }

  private transformToListItems(customers: Customer[]): CustomerListItem[] {
    const today = new Date();
    
    return customers.map(customer => ({
      id: customer.id,
      name: customer.name,
      lastOrderDate: customer.lastOrderDate,
      nextPredictedOrderDate: customer.nextPredictedOrderDate,
      daysSinceLastOrder: customer.lastOrderDate 
        ? this.calculateDaysDifference(customer.lastOrderDate, today)
        : null,
      daysToNextOrder: customer.nextPredictedOrderDate 
        ? this.calculateDaysDifference(today, customer.nextPredictedOrderDate)
        : null,
      status: customer.status
    }));
  }

  private applyFilters(customers: CustomerListItem[], filterCriteria?: CustomerFilterCriteria): CustomerListItem[] {
    if (!filterCriteria) return customers;

    return customers.filter(customer => {
      // Filtro por nombre
      if (filterCriteria.name) {
        const nameMatch = customer.name.toLowerCase().includes(filterCriteria.name.toLowerCase());
        if (!nameMatch) return false;
      }

      // Filtro por estado
      if (filterCriteria.status && customer.status !== filterCriteria.status) {
        return false;
      }

      return true;
    });
  }

  private calculateDaysDifference(fromDate: Date, toDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // milisegundos en un día
    const diffTime = toDate.getTime() - fromDate.getTime();
    return Math.round(diffTime / oneDay);
  }
  
  private buildFilterParams(filterCriteria?: CustomerFilterCriteria): Record<string, any> {
    if (!filterCriteria) return {};
    
    const params: Record<string, any> = {};
    
    if (filterCriteria.name) {
      params['name'] = filterCriteria.name;
    }
    
    if (filterCriteria.status) {
      params['status'] = filterCriteria.status;
    }
    
    if (filterCriteria.dateRange) {
      params['startDate'] = filterCriteria.dateRange.start.toISOString();
      params['endDate'] = filterCriteria.dateRange.end.toISOString();
    }
    
    return params;
  }
}
