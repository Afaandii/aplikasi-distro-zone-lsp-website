export interface Product {
  id: string;
  name: string;
  image: string;
  variant: string;
  quantity: number;
  price: number;
}

export interface Order {
  id: string;
  storeName: string;
  status: "waiting" | "processing" | "packing" | "shipping" | "completed";
  statusLabel: string;
  products: Product[];
  totalAmount: number;
  createdAt: string;
  recipient: {
    name: string;
    phone: string;
    address: string;
    city: string;
  };
  shipping: {
    courier: string;
    cost: number;
    trackingNumber?: string;
  };
  payment: {
    method: string;
    subtotal: number;
    shippingCost: number;
    total: number;
  };
}
