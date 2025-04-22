import { Order } from "./order";

export interface orderState {
  data: Order[];
  loading: boolean;
  error: string | null;
}
