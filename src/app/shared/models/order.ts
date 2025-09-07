export interface OrderRequest {
  custId: number;
  empId: number;
  shipperId: number;
  shipName: string | null;
  shipAddress: string | null;
  shipCity: string | null;
  orderDate: string | Date; // DateTime como string ISO o Date object
  requiredDate: string | Date; // DateTime como string ISO o Date object
  shippedDate: string | Date | null; // DateTime como string ISO, Date object, o nullable
  freight: number;
  shipCountry: string | null;
  productId: number;
  unitPrice: number;
  qty: number;
  discount: number;
  customerId?: string; // For modal compatibility
}

export interface Order {
  id: number;
  custId: number;
  empId: number;
  shipperId: number;
  shipName: string | null;
  shipAddress: string | null;
  shipCity: string | null;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date | null;
  freight: number;
  shipCountry: string | null;
  // Order details
  productId: number;
  unitPrice: number;
  qty: number;
  discount: number;
}

export interface OrderListItem {
  id: number;
  orderDate: Date;
  requiredDate: Date;
  shippedDate: Date | null;
  shipName: string | null;
  shipAddress: string | null;
  shipCity: string | null;
  shipCountry: string | null;
  freight: number;
  productName?: string; // From product lookup
  qty: number;
  unitPrice: number;
  discount: number;
  total: number; // Calculated field
}

export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  title: string;
  fullName: string; // Calculated field
}

export interface Product {
  id: number;
  productName: string;
  unitPrice: number;
  unitsInStock: number;
  categoryName?: string;
}

export interface Shipper {
  id: number;
  companyName: string;
  phone?: string;
}

export interface SalesPrediction {
  customerId: number;
  customerName: string;
  predictedDate: Date;
  confidence: number;
  lastOrderDate: Date | null;
}