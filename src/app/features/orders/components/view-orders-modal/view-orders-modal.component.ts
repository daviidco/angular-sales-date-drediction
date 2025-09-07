import { Component, inject, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '../../../../core/services/order.service';
import { OrderListItem } from '../../../../shared/models/order';

export interface ViewOrdersModalData {
  customerId: string;
  customerName: string;
}

@Component({
  selector: 'app-view-orders-modal',
  templateUrl: './view-orders-modal.component.html',
  styleUrls: ['./view-orders-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ]
})
export class ViewOrdersModalComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private dialogRef = inject(MatDialogRef<ViewOrdersModalComponent>);
  private data = inject<ViewOrdersModalData>(MAT_DIALOG_DATA);
  private orderService = inject(OrderService);

  dataSource = new MatTableDataSource<OrderListItem>([]);
  loading = true;
  error: string | null = null;

  readonly displayedColumns: string[] = [
    'id',
    'requiredDate',
    'shippedDate',
    'shipName',
    'shipAddress',
    'shipCity'
  ];

  readonly pageSizeOptions: number[] = [10, 25, 50];

  get customerName(): string {
    return this.data.customerName;
  }

  ngOnInit(): void {
    this.loadOrders();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    // Configurar sorting personalizado
    this.dataSource.sortingDataAccessor = (item: OrderListItem, property: string) => {
      switch (property) {
        case 'id':
          return item.id;
        case 'requiredDate':
          return item.requiredDate?.getTime() || 0;
        case 'shippedDate':
          return item.shippedDate?.getTime() || 0;
        case 'shipName':
          return item.shipName?.toLowerCase() || '';
        case 'shipAddress':
          return item.shipAddress?.toLowerCase() || '';
        case 'shipCity':
          return item.shipCity?.toLowerCase() || '';
        default:
          return '';
      }
    };
  }

  private loadOrders(): void {
    this.loading = true;
    this.error = null;

    const customerId = parseInt(this.data.customerId);
    
    this.orderService.getOrdersByCustomer(customerId).subscribe({
      next: (orders) => {
        this.dataSource.data = orders;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading orders:', error);
        this.error = 'Error loading orders. Please try again.';
        this.loading = false;
      }
    });
  }

  formatDate(date: Date | null): string {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  onClose(): void {
    this.dialogRef.close();
  }

  onRetry(): void {
    this.loadOrders();
  }
}