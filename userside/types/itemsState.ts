import { item } from "./item";

export interface ItemsState {
  data: item[];
  loading: boolean;
  error: string | null;
}
