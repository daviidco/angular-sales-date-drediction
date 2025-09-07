// API Response Interfaces based on OpenAPI spec

export interface Customer {
  id: number;
  companyName: string;
  contactName?: string;
  contactTitle?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  phone?: string;
  fax?: string;
}

export interface Employee {
  id: number;
  lastName: string;
  firstName: string;
  title?: string;
  titleOfCourtesy?: string;
  birthDate?: string;
  hireDate?: string;
  address?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  homePhone?: string;
  extension?: string;
  notes?: string;
  reportsTo?: number;
  fullName?: string; // For display purposes
}

export interface Product {
  id: number;
  productName: string;
  supplierId?: number;
  categoryId?: number;
  quantityPerUnit?: string;
  unitPrice?: number;
  unitsInStock?: number;
  unitsOnOrder?: number;
  reorderLevel?: number;
  discontinued?: boolean;
}

export interface Shipper {
  id: number;
  companyName: string;
  phone?: string;
}

export interface Order {
  id: number;
  custId: number;
  empId: number;
  orderDate: string;
  requiredDate: string;
  shippedDate?: string;
  shipperId: number;
  freight: number;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  shipRegion?: string;
  shipPostalCode?: string;
  shipCountry?: string;
}

export interface OrderRequest {
  custId: number;
  empId: number;
  shipperId: number;
  shipName?: string;
  shipAddress?: string;
  shipCity?: string;
  orderDate: string; // ISO date string
  requiredDate: string; // ISO date string
  shippedDate?: string; // ISO date string
  freight: number;
  shipCountry?: string;
  productId: number;
  unitPrice: number;
  qty: number;
  discount: number;
}

export interface SalesDatePrediction {
  customerId: number;
  customerName: string;
  predictedDate: string;
  confidence: number;
  lastOrderDate?: string;
}