// customer-data-table.component.ts
import {
  Component,
  Input,
  OnInit,
  AfterViewInit,
  OnChanges,
  ViewChild,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button'; // ✅ AGREGAR ESTE IMPORT
import { CustomerListItem } from '../../../../shared/models/customer';
import { CustomerTitleComponent } from '../customer-title/customer-title.component';
import { CustomerFilterComponent } from '../customer-filter/customer-filter.component';

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
    MatButtonModule,
    CustomerTitleComponent,
    CustomerFilterComponent
  ],
})
export class CustomerDataTableComponent implements OnInit, AfterViewInit, OnChanges {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  @Input() customers: CustomerListItem[] = [];
  @Input() loading = false;

  @Output() viewOrders = new EventEmitter<string>();
  @Output() newOrder = new EventEmitter<string>();
  @Output() filterChange = new EventEmitter<string>();

  dataSource = new MatTableDataSource<CustomerListItem>([]);
  readonly displayedColumns: string[] = [
    'name',
    'lastOrderDate',
    'nextPredictedOrderDate',
    'actions',
  ];
  readonly pageSizeOptions: number[] = [10, 25, 50, 100];

  ngOnInit(): void {
    this.updateDataSource();
  }

  ngAfterViewInit(): void {
    // Configurar sorting personalizado para fechas
    this.dataSource.sortingDataAccessor = (item: CustomerListItem, property: string) => {
      switch (property) {
        case 'name':
          return item.name.toLowerCase();
        case 'lastOrderDate':
          return item.lastOrderDate?.getTime() || 0;
        case 'nextPredictedOrderDate':
          return item.nextPredictedOrderDate?.getTime() || 0;
        default:
          return '';
      }
    };

    // Configurar filtro personalizado
    this.dataSource.filterPredicate = (data: CustomerListItem, filter: string) => {
      return data.name.toLowerCase().includes(filter);
    };

    // Asignar paginator y sort
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(): void {
    this.updateDataSource();
  }

  private updateDataSource(): void {
    this.dataSource.data = this.customers;
    
    // Reconectar paginator y sort después de actualizar data
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
      this.paginator.firstPage();
    }
    
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  trackByCustomerId(_index: number, item: CustomerListItem): string {
    return item.id;
  }

  formatDate(date: Date | null): string {
    if (!date) return 'Sin registro';
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  onViewOrders(customerId: string): void {
    this.viewOrders.emit(customerId);
  }

  onNewOrder(customerId: string): void {
    this.newOrder.emit(customerId);
  }

  onFilterChange(filterValue: string): void {
    // Aplicar filtro local usando MatTableDataSource
    this.dataSource.filter = filterValue.trim().toLowerCase();
    
    // Reset paginator al filtrar
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    
    // También emitir el evento por si el componente padre lo necesita
    this.filterChange.emit(filterValue);
  }
}
