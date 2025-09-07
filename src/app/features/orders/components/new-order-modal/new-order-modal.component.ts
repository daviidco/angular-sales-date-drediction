import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { OrderService } from '../../../../core/services/order.service';
import { Employee, Product, Shipper } from '../../../../core/models/api-interfaces';
import { OrderRequest } from '../../../../shared/models/order';

export interface NewOrderModalData {
  customerId: string;
  customerName: string;
}

@Component({
  selector: 'app-new-order-modal',
  templateUrl: './new-order-modal.component.html',
  styleUrls: ['./new-order-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatProgressSpinnerModule
  ]
})
export class NewOrderModalComponent implements OnInit {
  private dialogRef = inject(MatDialogRef<NewOrderModalComponent>);
  private data = inject<NewOrderModalData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  
  private orderService = inject(OrderService);

  orderForm!: FormGroup;
  
  employees: Employee[] = [];
  products: Product[] = [];
  shippers: Shipper[] = [];
  
  loading = false;
  submitting = false;
  error: string | null = null;

  get customerName(): string {
    return this.data.customerName;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.loadFormData();
  }

  private initializeForm(): void {
    this.orderForm = this.fb.group({
      // Order section
      empId: [null, Validators.required],
      shipperId: [null, Validators.required],
      shipName: ['', Validators.required],
      shipAddress: ['', Validators.required],
      shipCity: ['', Validators.required],
      shipCountry: ['', Validators.required],
      orderDate: [new Date(), Validators.required],
      requiredDate: [null, Validators.required],
      shippedDate: [null],
      freight: [0, [Validators.required, Validators.min(0)]],
      
      // Order Details section
      productId: [null, Validators.required],
      unitPrice: [0, [Validators.required, Validators.min(0)]],
      qty: [1, [Validators.required, Validators.min(1)]],
      discount: [0, [Validators.min(0), Validators.max(1)]]
    });
  }

  private loadFormData(): void {
    this.loading = true;
    
    Promise.all([
      this.orderService.getEmployees().toPromise(),
      this.orderService.getProducts().toPromise(),
      this.orderService.getShippers().toPromise()
    ]).then(([employees, products, shippers]) => {
      this.employees = employees || [];
      this.products = products || [];
      this.shippers = shippers || [];
      
      // Add fullName for employees for display
      this.employees = this.employees.map(emp => ({
        ...emp,
        fullName: `${emp.firstName} ${emp.lastName}`
      }));
      
      this.loading = false;
    }).catch(error => {
      console.error('Error loading form data:', error);
      this.error = 'Error loading form data. Please try again.';
      this.loading = false;
    });
  }

  onProductChange(productId: number): void {
    const selectedProduct = this.products.find(p => p.id === productId);
    if (selectedProduct) {
      this.orderForm.patchValue({
        unitPrice: selectedProduct.unitPrice
      });
    }
  }

  calculateTotal(): number {
    const unitPrice = this.orderForm.get('unitPrice')?.value || 0;
    const qty = this.orderForm.get('qty')?.value || 0;
    const discount = this.orderForm.get('discount')?.value || 0;
    
    return (unitPrice * qty) * (1 - discount);
  }

  onSubmit(): void {
    if (this.orderForm.valid) {
      this.submitting = true;
      this.error = null;

      const formValue = this.orderForm.value;
      
      const orderRequest: OrderRequest = {
        custId: parseInt(this.data.customerId),
        customerId: this.data.customerId,
        empId: formValue.empId,
        shipperId: formValue.shipperId,
        shipName: formValue.shipName,
        shipAddress: formValue.shipAddress,
        shipCity: formValue.shipCity,
        shipCountry: formValue.shipCountry,
        orderDate: formValue.orderDate,
        requiredDate: formValue.requiredDate,
        shippedDate: formValue.shippedDate,
        freight: formValue.freight,
        productId: formValue.productId,
        unitPrice: formValue.unitPrice,
        qty: formValue.qty,
        discount: formValue.discount
      };

      this.orderService.createOrder(orderRequest).subscribe({
        next: (result) => {
          console.log('Order created successfully:', result);
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Error creating order:', error);
          this.error = 'Error creating order. Please try again.';
          this.submitting = false;
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.orderForm.controls).forEach(key => {
      this.orderForm.get(key)?.markAsTouched();
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getFieldError(fieldName: string): string {
    const field = this.orderForm.get(fieldName);
    if (field?.errors && field.touched) {
      if (field.errors['required']) return `${this.getFieldLabel(fieldName)} is required`;
      if (field.errors['min']) return `${this.getFieldLabel(fieldName)} must be greater than ${field.errors['min'].min}`;
      if (field.errors['max']) return `${this.getFieldLabel(fieldName)} must be less than ${field.errors['max'].max}`;
    }
    return '';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      empId: 'Employee',
      shipperId: 'Shipper',
      shipName: 'Ship Name',
      shipAddress: 'Ship Address',
      shipCity: 'Ship City',
      shipCountry: 'Ship Country',
      orderDate: 'Order Date',
      requiredDate: 'Required Date',
      shippedDate: 'Shipped Date',
      freight: 'Freight',
      productId: 'Product',
      unitPrice: 'Unit Price',
      qty: 'Quantity',
      discount: 'Discount'
    };
    return labels[fieldName] || fieldName;
  }
}