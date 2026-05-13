// User type
export interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "staff";
}

// Product type
export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: "Electronics" | "Furniture" | "Health" | "Apparel" | "Other";
  sku: string;
  createdAt: string;
  updatedAt: string;
}

// Order Item type
export interface OrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
}

// Order type
export interface Order {
  _id: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled";
  note?: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

// Auth Context type
export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<User>;
  logout: () => void;
}

// API Response type
export interface ApiResponse<T> {
  message: string;
  data?: T;
}