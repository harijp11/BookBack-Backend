export interface User {
    id: number;
    name: string;
    transactions: number;
    amount: number;
  }
  
  export interface Category {
    id: number;
    name: string;
    sales: number;
    amount: number;
  }
  
  export interface DashboardData {
    totalSales: number;
    totalRentals: number;
    totalUsers: number;
    salesData: SalesData;
    topUsers: User[];
    topCategories: Category[];
  }

  export interface DashboardQuery {
    startDate?: string;
    endDate?: string;
    view?: 'daily' | 'weekly' | 'monthly' | 'yearly';
    topLimit?: string;
  }

 export  interface DataPoint {
    sale: number;
    rental: number;
    saleCount?: number;
    rentalCount?: number;
  }

export interface SalesData {
    daily: Array<{ day: string } & DataPoint>;
    monthly: Array<{ month: string } & DataPoint>;
    weekly: Array<{ week: string } & DataPoint>;
    yearly: Array<{ year: string } & DataPoint>;
  }

  export interface User {
    id: number;
    name: string;
    transactions: number;
    amount: number;
  }
  export interface Category {
    id: number;
    name: string;
    sales: number;
    amount: number;
  }
  