import { Item } from "./item";

export interface ItemsState {
  data: Item[];
  loading: boolean;
  error: string | null;
}
