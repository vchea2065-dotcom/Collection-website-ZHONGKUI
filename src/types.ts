export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  brand: string;
  price: number;
  discountPrice?: number | null;
  stock: number;
  condition: string;
  featured: boolean;
  newArrival: boolean;
  rareCollection?: boolean;
  status: 'published' | 'draft' | 'sold_out';
  mainImage: string;
  images: string[];
  description: string;
  specifications: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'admin' | 'customer';
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  notes?: string;
  paymentMethod: 'ABA_BANK' | 'KHQR' | 'BANK_TRANSFER' | 'CASH_ON_DELIVERY';
  paymentStatus: 'pending' | 'verified' | 'paid' | 'failed';
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  count?: number;
}
