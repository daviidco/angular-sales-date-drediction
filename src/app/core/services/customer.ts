import { Injectable } from '@angular/core';
import { Observable, of, delay, map } from 'rxjs';
import { Customer, CustomerListItem, CustomerFilterCriteria, CustomerStatus } from '../../shared/models/customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
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

  getCustomers(filterCriteria?: CustomerFilterCriteria): Observable<CustomerListItem[]> {
    return of(this.mockCustomers).pipe(
      delay(800), // Simular latencia de red
      map(customers => this.transformToListItems(customers)),
      map(customers => this.applyFilters(customers, filterCriteria))
    );
  }

  getCustomerById(id: string): Observable<Customer | null> {
    return of(this.mockCustomers.find(customer => customer.id === id) || null).pipe(
      delay(300)
    );
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
}
