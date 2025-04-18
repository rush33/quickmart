import { Shop } from "./shop";

export interface ShopState {
  data: Shop[];
  loading: boolean;
  error: string | null;
}
