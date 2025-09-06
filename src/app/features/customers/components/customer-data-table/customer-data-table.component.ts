import { Component, Input, OnInit, AfterViewInit, OnChanges, ViewChild, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { CustomerListItem, CustomerStatus } from '../../../../shared/models/customer';

@Component({
  selector: 'app-customer-data-table',
  templateUrl: './customer-data-table.component.html',
  styleUrls: ['./customer-data-table.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule
  ]
})
export class CustomerDataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() customers: CustomerListItem[] = [];
  @Input() loading = false;

  @Output() viewOrders = new EventEmitter<string>();
  @Output() newOrder = new EventEmitter<string>();

  dataSource = new MatTableDataSource<CustomerListItem>([]);
  
  readonly displayedColumns: string[] = ['name', 'lastOrderDate', 'nextPredictedOrderDate', 'actions'];
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];
  

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Configurar sorting personalizado para fechas
    this.dataSource.sortingDataAccessor = (item: CustomerListItem, property: string) => {
      switch (property) {
        case 'name': return item.name.toLowerCase();
        case 'lastOrderDate': return item.lastOrderDate?.getTime() || 0;
        case 'nextPredictedOrderDate': return item.nextPredictedOrderDate?.getTime() || 0;
        default: return (item as any)[property];
      }
    };
  }

  ngOnChanges(): void {
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource.data = this.customers;
    
    // Reset a la primera página cuando cambien los datos
    if (this.paginator) {
      this.paginator.firstPage();
    }
  }

  trackByCustomerId(index: number, item: CustomerListItem): string {
    return item.id;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Sin registro';
    
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatDays(days: number | null): string {
    if (days === null) return '-';
    
    if (days === 0) return 'Hoy';
    if (days === 1) return 'Mañana';
    if (days > 0) return `En ${days} días`;
    if (days === -1) return 'Ayer';
    return `Hace ${Math.abs(days)} días`;
  }

  onViewOrders(customerId: string): void {
    this.viewOrders.emit(customerId);
  }

  onNewOrder(customerId: string): void {
    this.newOrder.emit(customerId);
  }

  getDaysClass(days: number | null): string {
    if (days === null) return '';
    if (days < 0) return 'days-past';
    if (days <= 7) return 'days-soon';
    return 'days-future';
  }
}