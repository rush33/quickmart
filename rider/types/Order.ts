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

export type ExtendedOrder = Order & {
  userName: string; // Add full name here
};

export type Shop = {
  id: string;
  name: string;
  image: string;
  rating: number;
  address: string;
  genre: string[];
  lat: number;
  long: number;
};

export type User = {
  userId: string;
  fname: string;
  lastName?: string;
  email: string;
  coords?: Coordinates;
  address: string;
  phoneNumber: string;
};

export type FullOrder = {
  order: Order;
  shop: Shop | null;
  user: User | null;
};