export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  lastOrderDate: Date | null;
  nextPredictedOrderDate: Date | null;
  totalOrders: number;
  status: CustomerStatus;
  createdAt: Date;
}

export interface CustomerListItem {
  id: string;
  name: string;
  lastOrderDate: Date | null;
  nextPredictedOrderDate: Date | null;
  daysSinceLastOrder: number | null;
  daysToNextOrder: number | null;
  status: CustomerStatus;
}

export interface CustomerFilterCriteria {
  name?: string;
  status?: CustomerStatus;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export enum CustomerStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  AT_RISK = 'at_risk',
  NEW = 'new'
}
