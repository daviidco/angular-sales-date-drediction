import { Injectable, inject } from '@angular/core';
import { Observable, of, map } from 'rxjs';
import { ApiService } from '../api/api.service';
import { API_ENDPOINTS } from '../api/api.config';
import { Order, OrderRequest, OrderListItem } from '../../shared/models/order';
import { 
  Order as ApiOrder, 
  OrderRequest as ApiOrderRequest,
  Employee,
  Product,
  Shipper 
} from '../models/api-interfaces';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiService = inject(ApiService);

  getOrders(): Observable<Order[]> {
    return this.apiService.get<any>(API_ENDPOINTS.ORDER).pipe(
      map(response => {
        let data: any[];
        if ((response?.success || response?.sucess) && Array.isArray(response.result)) {
          data = response.result;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('API response format not recognized:', response);
          return [];
        }
        return data.map(apiOrder => this.transformApiOrderToOrder(apiOrder));
      })
    );
  }

  getOrdersByCustomer(clientId: number): Observable<OrderListItem[]> {
    return this.apiService.get<any>(API_ENDPOINTS.ORDER, {
      params: { clientId: clientId }
    }).pipe(
      map(response => {
        let data: any[];
        if ((response?.success || response?.sucess) && Array.isArray(response.result)) {
          data = response.result;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('API response format not recognized for orders:', response);
          return [];
        }
        return this.transformApiOrdersToListItems(data);
      })
    );
  }

  createOrder(order: OrderRequest): Observable<Order> {
    const apiOrderRequest: ApiOrderRequest = this.transformOrderRequestToApi(order);
    return this.apiService.post<ApiOrder>(API_ENDPOINTS.ORDER, apiOrderRequest).pipe(
      map(apiOrder => this.transformApiOrderToOrder(apiOrder))
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.apiService.get<any>(API_ENDPOINTS.EMPLOYEE).pipe(
      map(response => {
        let data: any[];
        if ((response?.success || response?.sucess) && Array.isArray(response.result)) {
          data = response.result;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('API response format not recognized for employees:', response);
          return [];
        }
        return data;
      })
    );
  }

  getProducts(): Observable<Product[]> {
    return this.apiService.get<any>(API_ENDPOINTS.PRODUCT).pipe(
      map(response => {
        let data: any[];
        if ((response?.success || response?.sucess) && Array.isArray(response.result)) {
          data = response.result;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('API response format not recognized for products:', response);
          return [];
        }
        return data;
      })
    );
  }

  getShippers(): Observable<Shipper[]> {
    return this.apiService.get<any>(API_ENDPOINTS.SHIPPER).pipe(
      map(response => {
        let data: any[];
        if ((response?.success || response?.sucess) && Array.isArray(response.result)) {
          data = response.result;
        } else if (Array.isArray(response)) {
          data = response;
        } else {
          console.warn('API response format not recognized for shippers:', response);
          return [];
        }
        return data;
      })
    );
  }

  getSalesPrediction(): Observable<unknown> {
    return this.apiService.get(API_ENDPOINTS.SALES_PREDICTION);
  }

  private transformApiOrdersToListItems(apiOrders: ApiOrder[]): OrderListItem[] {
    return apiOrders.map(apiOrder => ({
      id: apiOrder.id,
      orderDate: new Date(apiOrder.orderDate),
      requiredDate: new Date(apiOrder.requiredDate),
      shippedDate: apiOrder.shippedDate ? new Date(apiOrder.shippedDate) : null,
      shipName: apiOrder.shipName || '',
      shipAddress: apiOrder.shipAddress || '',
      shipCity: apiOrder.shipCity || '',
      shipCountry: apiOrder.shipCountry || '',
      freight: apiOrder.freight,
      productName: '', // Se necesitaría join con productos
      qty: 0, // Se necesitaría desde order details
      unitPrice: 0, // Se necesitaría desde order details
      discount: 0, // Se necesitaría desde order details
      total: 0 // Calcular basado en qty * unitPrice * (1 - discount) + freight
    }));
  }

  private transformOrderRequestToApi(order: OrderRequest): ApiOrderRequest {
    const convertDateToString = (date: string | Date): string => {
      return typeof date === 'string' ? date : date.toISOString();
    };

    return {
      custId: order.customerId ? parseInt(order.customerId) : order.custId,
      empId: order.empId,
      shipperId: order.shipperId,
      shipName: order.shipName || undefined,
      shipAddress: order.shipAddress || undefined,
      shipCity: order.shipCity || undefined,
      orderDate: convertDateToString(order.orderDate),
      requiredDate: convertDateToString(order.requiredDate),
      shippedDate: order.shippedDate ? convertDateToString(order.shippedDate) : undefined,
      freight: order.freight,
      shipCountry: order.shipCountry || undefined,
      productId: order.productId,
      unitPrice: order.unitPrice,
      qty: order.qty,
      discount: order.discount
    };
  }

  private transformApiOrderToOrder(apiOrder: ApiOrder): Order {
    return {
      id: apiOrder.id,
      custId: apiOrder.custId,
      empId: apiOrder.empId,
      orderDate: new Date(apiOrder.orderDate),
      requiredDate: new Date(apiOrder.requiredDate),
      shippedDate: apiOrder.shippedDate ? new Date(apiOrder.shippedDate) : null,
      shipperId: apiOrder.shipperId,
      freight: apiOrder.freight,
      shipName: apiOrder.shipName || null,
      shipAddress: apiOrder.shipAddress || null,
      shipCity: apiOrder.shipCity || null,
      shipCountry: apiOrder.shipCountry || null,
      productId: 0, // Placeholder - would come from order details
      unitPrice: 0, // Placeholder - would come from order details
      qty: 0, // Placeholder - would come from order details
      discount: 0 // Placeholder - would come from order details
    };
  }
}
