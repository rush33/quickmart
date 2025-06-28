import { CartItem } from "@/types/cartItem";
import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Alert } from "react-native";

export interface CartState {
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

      if (state.shopId !== itemShopId) {
        Alert.alert(
          "Oops!",
          `You cannot add ${action.payload.name} as it's from a different shop.`,
          [{ text: "OK", style: "cancel" }],
          { cancelable: true }
        );
        return;
      }
      const existingItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingItemIndex >= 0) {
        state.items[existingItemIndex].quantity += 1;
      } else {
        state.items.push(action.payload);
      }
    },

    removeFromCart: (state, action: PayloadAction<{ id: string }>) => {
      const index = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (index >= 0) {
        if (state.items[index].quantity > 1) {
          state.items[index].quantity -= 1;
        } else {
          state.items.splice(index, 1);
        }
      } else {
        console.warn(
          `Can't remove product (id: ${action.payload.id}) as it's not in the cart!`
        );
      }

      if (state.items.length === 0) {
        state.shopId = null;
      }
    },
    clearCart: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(clearCart, () => {
      return { ...initialState };
    });
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;

export interface RootState {
  cart: CartState;
}

export const selectCartItems = (state: RootState): CartItem[] =>
  state.cart.items;

export const selectCartItemById = (state: RootState, id: string) =>
  state.cart.items.find((item) => item.id === id);

export const selectCartTotal = (state: RootState): number =>
  state.cart.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

export default cartSlice.reducer;
