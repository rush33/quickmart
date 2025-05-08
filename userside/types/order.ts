import { CartItem } from "./cartItem";

export type Coordinates = { latitude: number; longitude: number };

export type Order = {
  orderId?: string;
  address: string;
  createdAt?: string;
  items: CartItem[];
  shopId: string;
  shopName: string;
  status: string;
  totalAmount: number;
  userId: string;
  userCoords: Coordinates;
};
