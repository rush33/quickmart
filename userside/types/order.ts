import { CartItem } from "./cartItem";

export type Coordinates = { latitude: number; longitude: number };

export type Order = {
  address: string;
  createdAt?: string;
  items: CartItem[];
  orderId?: string;
  riderId?: string;
  riderName?: string;
  riderPhone?: string;
  shopId: string;
  shopName: string;
  status: string;
  totalAmount: number;
  userId: string;
  userCoords: Coordinates;
};
