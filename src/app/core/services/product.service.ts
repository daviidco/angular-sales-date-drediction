import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { ApiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/api.config';
import { Product } from '../../shared/models/order';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private apiService = inject(ApiService);

  private mockProducts: Product[] = [
    {
      id: 1,
      productName: 'Chai',
      unitPrice: 18.00,
      unitsInStock: 39,
      categoryName: 'Beverages'
    },
    {
      id: 2,
      productName: 'Chang',
      unitPrice: 19.00,
      unitsInStock: 17,
      categoryName: 'Beverages'
    },
    {
      id: 3,
      productName: 'Aniseed Syrup',
      unitPrice: 10.00,
      unitsInStock: 13,
      categoryName: 'Condiments'
    },
    {
      id: 4,
      productName: 'Chef Anton\'s Cajun Seasoning',
      unitPrice: 22.00,
      unitsInStock: 53,
      categoryName: 'Condiments'
    }
  ];

  getProducts(): Observable<Product[]> {
    // return this.apiService.get<Product[]>(API_ENDPOINTS.PRODUCT);
    return of(this.mockProducts); // Mock data for now
  }
}