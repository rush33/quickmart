export interface CartItem {
  id: string;
  name: string;
  price: number;
  shopId: string;
  quantity: number;
  [key: string]: any;
}
