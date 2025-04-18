import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "react-native";

interface CartItem {
  id: string;
  name: string;
  price: number;
  shopId: string;
  [key: string]: any; 
}

interface CartState {
  shopId: string | null;
  items: CartItem[];
}

const initialState: CartState = {
  shopId: null,
  items: [],
};

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const itemShopId = action.payload.shopId;

      if (state.shopId === null) {
        state.shopId = itemShopId;
      }

      if (state.shopId === itemShopId) {
        state.items.push(action.payload);
      } else {
        Alert.alert(
          "Oops!",
          `You cannot add ${action.payload.name} as it's from a different shop.`,
          [{ text: "OK", style: "cancel" }],
          { cancelable: true }
        );
      }
    },

    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        console.warn(
          `Can't remove product (id: ${action.payload.id}) as it's not in the cart!`
        );
      }

      // Optional: Reset shopId when cart is empty
      if (state.items.length === 0) {
        state.shopId = null;
      }
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

// Selectors
export const selectCartItems = (state: { cart: CartState }) => state.cart.items;

export const selectCartItemsWithId = (state: { cart: CartState }, id: string) =>
  state.cart.items.filter((item) => item.id === id);

export const selectCartTotal = (state: { cart: CartState }) =>
  state.cart.items.reduce((total, item) => total + item.price, 0);

export default cartSlice.reducer;
