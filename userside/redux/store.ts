import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import shopReducer from "./slices/shopSlice";
import itemsReducer from "./slices/itemsSlice";
import orderReducer from "./slices/orderSlice";
import rootReducer from "./rootReducer";

export const store = configureStore({
  reducer: {
    reducer: rootReducer,
    cart: cartReducer,
    shop: shopReducer,
    shopProducts: itemsReducer,
    order: orderReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["your/action/type"],
        ignoredActionPaths: ["meta.arg", "payload.timestamp"],
        ignoredPaths: ["items.dates"],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
