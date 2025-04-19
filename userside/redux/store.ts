import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import shopReducer from "./slices/shopSlice";
import itemsReducer from "./slices/itemsSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    shop: shopReducer,
    shopProducts: itemsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
