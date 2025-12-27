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

export const DUMMY_ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    storeName: "Power Shop",
    status: "shipping",
    statusLabel: "Dikirim",
    createdAt: "2024-12-25",
    products: [
      {
        id: "p1",
        name: "Hoodie Oversize Premium",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
        variant: "Hitam, L",
        quantity: 1,
        price: 285000,
      },
    ],
    totalAmount: 295000,
    recipient: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, RT 05/RW 02",
      city: "Surabaya",
    },
    shipping: {
      courier: "JNE REG",
      cost: 10000,
      trackingNumber: "JNE123456789",
    },
    payment: {
      method: "Transfer Bank BCA",
      subtotal: 285000,
      shippingCost: 10000,
      total: 295000,
    },
  },
  {
    id: "ORD-2024-002",
    storeName: "EHEUY FACTORY",
    status: "processing",
    statusLabel: "Diproses",
    createdAt: "2024-12-26",
    products: [
      {
        id: "p2",
        name: "Crewneck Essential",
        image:
          "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=200&h=200&fit=crop",
        variant: "Abu-abu, M",
        quantity: 2,
        price: 195000,
      },
      {
        id: "p3",
        name: "T-Shirt Basic",
        image:
          "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200&h=200&fit=crop",
        variant: "Putih, XL",
        quantity: 1,
        price: 125000,
      },
    ],
    totalAmount: 527000,
    recipient: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, RT 05/RW 02",
      city: "Surabaya",
    },
    shipping: {
      courier: "SiCepat REG",
      cost: 12000,
    },
    payment: {
      method: "OVO",
      subtotal: 515000,
      shippingCost: 12000,
      total: 527000,
    },
  },
  {
    id: "ORD-2024-003",
    storeName: "Power Shop",
    status: "waiting",
    statusLabel: "Menunggu Verifikasi",
    createdAt: "2024-12-27",
    products: [
      {
        id: "p4",
        name: "Jaket Bomber Premium",
        image:
          "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=200&h=200&fit=crop",
        variant: "Navy, L",
        quantity: 1,
        price: 425000,
      },
    ],
    totalAmount: 437000,
    recipient: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, RT 05/RW 02",
      city: "Surabaya",
    },
    shipping: {
      courier: "JNT REG",
      cost: 12000,
    },
    payment: {
      method: "Transfer Bank BCA",
      subtotal: 425000,
      shippingCost: 12000,
      total: 437000,
    },
  },
  {
    id: "ORD-2024-004",
    storeName: "EHEUY FACTORY",
    status: "completed",
    statusLabel: "Selesai",
    createdAt: "2024-12-20",
    products: [
      {
        id: "p5",
        name: "Hoodie Zipper Classic",
        image:
          "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=200&h=200&fit=crop",
        variant: "Maroon, XL",
        quantity: 1,
        price: 295000,
      },
    ],
    totalAmount: 307000,
    recipient: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, RT 05/RW 02",
      city: "Surabaya",
    },
    shipping: {
      courier: "JNE YES",
      cost: 12000,
      trackingNumber: "JNE987654321",
    },
    payment: {
      method: "GoPay",
      subtotal: 295000,
      shippingCost: 12000,
      total: 307000,
    },
  },
  {
    id: "ORD-2024-005",
    storeName: "Power Shop",
    status: "packing",
    statusLabel: "Dikemas",
    createdAt: "2024-12-26",
    products: [
      {
        id: "p6",
        name: "Kemeja Flanel Premium",
        image:
          "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=200&h=200&fit=crop",
        variant: "Kotak Merah, L",
        quantity: 1,
        price: 215000,
      },
    ],
    totalAmount: 225000,
    recipient: {
      name: "Budi Santoso",
      phone: "081234567890",
      address: "Jl. Merdeka No. 123, RT 05/RW 02",
      city: "Surabaya",
    },
    shipping: {
      courier: "JNE REG",
      cost: 10000,
    },
    payment: {
      method: "COD",
      subtotal: 215000,
      shippingCost: 10000,
      total: 225000,
    },
  },
];
