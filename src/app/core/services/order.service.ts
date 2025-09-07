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
    return this.apiService.get<Order[]>(API_ENDPOINTS.ORDER);
  }

  getOrdersByCustomer(clientId: number): Observable<OrderListItem[]> {
    return this.apiService.get<ApiOrder[]>(API_ENDPOINTS.ORDER, {
      params: { clientId: clientId }
    }).pipe(
      map(apiOrders => this.transformApiOrdersToListItems(apiOrders))
    );
  }

  createOrder(order: OrderRequest): Observable<Order> {
    const apiOrderRequest: ApiOrderRequest = this.transformOrderRequestToApi(order);
    return this.apiService.post<ApiOrder>(API_ENDPOINTS.ORDER, apiOrderRequest).pipe(
      map(apiOrder => this.transformApiOrderToOrder(apiOrder))
    );
  }

  getEmployees(): Observable<Employee[]> {
    return this.apiService.get<Employee[]>(API_ENDPOINTS.EMPLOYEE);
  }

  getProducts(): Observable<Product[]> {
    return this.apiService.get<Product[]>(API_ENDPOINTS.PRODUCT);
  }

  getShippers(): Observable<Shipper[]> {
    return this.apiService.get<Shipper[]>(API_ENDPOINTS.SHIPPER);
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
    return {
      custId: parseInt(order.customerId),
      empId: order.empId,
      shipperId: order.shipperId,
      shipName: order.shipName,
      shipAddress: order.shipAddress,
      shipCity: order.shipCity,
      orderDate: order.orderDate.toISOString(),
      requiredDate: order.requiredDate.toISOString(),
      shippedDate: order.shippedDate?.toISOString(),
      freight: order.freight,
      shipCountry: order.shipCountry,
      productId: order.productId,
      unitPrice: order.unitPrice,
      qty: order.qty,
      discount: order.discount
    };
  }

  private transformApiOrderToOrder(apiOrder: ApiOrder): Order {
    return {
      id: apiOrder.id.toString(),
      customerId: apiOrder.custId.toString(),
      empId: apiOrder.empId,
      orderDate: new Date(apiOrder.orderDate),
      requiredDate: new Date(apiOrder.requiredDate),
      shippedDate: apiOrder.shippedDate ? new Date(apiOrder.shippedDate) : undefined,
      shipperId: apiOrder.shipperId,
      freight: apiOrder.freight,
      shipName: apiOrder.shipName || '',
      shipAddress: apiOrder.shipAddress || '',
      shipCity: apiOrder.shipCity || '',
      shipRegion: apiOrder.shipRegion || '',
      shipPostalCode: apiOrder.shipPostalCode || '',
      shipCountry: apiOrder.shipCountry || ''
    };
  }
}
