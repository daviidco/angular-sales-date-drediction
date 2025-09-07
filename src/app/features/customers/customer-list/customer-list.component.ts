import { Component, OnInit, signal, computed, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

import { CustomerService } from '../../../core/services/customer';
import { CustomerListItem, CustomerFilterCriteria } from '../../../shared/models/customer';

// Componentes
import { CustomerDataTableComponent } from '../components/customer-data-table/customer-data-table.component';
import { MatDialog } from '@angular/material/dialog';
import {
  ViewOrdersModalComponent,
  ViewOrdersModalData,
} from '../../orders/components/view-orders-modal/view-orders-modal.component';
import {
  NewOrderModalComponent,
  NewOrderModalData,
} from '../../orders/components/new-order-modal/new-order-modal.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.scss'],
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatDialogModule, CustomerDataTableComponent],
})
export class CustomerListComponent implements OnInit {
  private customerService = inject(CustomerService);
  private destroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

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

    this.customerService
      .getCustomers(this.currentFilterCriteria)
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
        },
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

  onViewOrders(event: {customerId: string, customerName: string}): void {
    const data: ViewOrdersModalData = { customerId: event.customerId, customerName: event.customerName };

    this.dialog.open(ViewOrdersModalComponent, {
      width: '80%',
      data,
    });
  }

  onNewOrder(customerId: string): void {
    // Find customer name
    const customer = this.customers().find(c => c.id === customerId);
    const customerName = customer?.name || 'Unknown Customer';
    
    const data: NewOrderModalData = { customerId, customerName };

    const dialogRef = this.dialog.open(NewOrderModalComponent, {
      width: '70%',
      maxWidth: '800px',
      data,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Order created:', result);
        // Optionally refresh customer data or show success message
      }
    });
  }
}
