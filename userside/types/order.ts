import { FieldValue } from "firebase/firestore";
import { CartItem } from "./cartItem";

type Coordinates = { latitude: number; longitude: number };

export type Order = {
  orderId?: string;
  address: string;
  createdAt?: Date | FieldValue;
  items: CartItem[];
  shopId: string;
  status: string;
  totalAmount: number;
  userId: string;
  userCoords: Coordinates;
};
