import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { CustomerService } from '../../../core/services/customer';
import { CustomerListItem, CustomerFilterCriteria } from '../../../shared/models/customer';

// Componentes
import { CustomerDataTableComponent } from '../components/customer-data-table/customer-data-table.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    CustomerDataTableComponent
  ]
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private destroyRef = inject(DestroyRef);

  // Estado reactivo
  customers = signal<CustomerListItem[]>([]);
  filteredCustomers = signal<CustomerListItem[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);
  currentFilterCriteria: CustomerFilterCriteria = {};

  // Computed values
  customerCount = computed(() => this.filteredCustomers().length);
  
  ngOnInit(): void {
    this.loadCustomers();
  }

  private loadCustomers(): void {
    this.loading.set(true);
    this.error.set(null);
    
    this.customerService.getCustomers(this.currentFilterCriteria)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (customers) => {
          this.customers.set(customers);
          this.filteredCustomers.set(customers);
          this.loading.set(false);
        },
        error: (err) => {
          console.error('Error loading customers:', err);
          this.error.set('Error al cargar los clientes. Por favor, intente nuevamente.');
          this.loading.set(false);
        }
      });
  }

  onFilterChange(filterValue: string): void {
    // No recargar datos, el filtrado es local en la tabla
    // Solo mantener el criterio para futuras cargas si es necesario
    this.currentFilterCriteria = { name: filterValue };
  }

  onClearFilters(): void {
    this.currentFilterCriteria = {};
    this.loadCustomers();
  }

  onRetry(): void {
    this.loadCustomers();
  }

  onViewOrders(customerId: string): void {
    // TODO: Implementar navegación a vista de órdenes
    console.log('View orders for customer:', customerId);
  }

  onNewOrder(customerId: string): void {
    // TODO: Implementar navegación a nueva orden
    console.log('New order for customer:', customerId);
  }
}