import { environment } from '../../../environments/environment';

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
}

export const API_CONFIG: ApiConfig = {
  baseUrl: environment.apiBaseUrl,
  timeout: 30000 // 30 segundos
};

export const API_ENDPOINTS = {
  CUSTOMER: '/Customer',
  ORDER: '/Order',
  EMPLOYEE: '/Employee',
  PRODUCT: '/Product',
  SHIPPER: '/Shipper',
  SALES_PREDICTION: '/Order/getSalesDatePrediction'
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS[keyof typeof API_ENDPOINTS];