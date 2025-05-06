import { combineReducers } from "@reduxjs/toolkit";
import cartReducer from "./slices/cartSlice";
import shopReducer from "./slices/shopSlice";
import itemsReducer from "./slices/itemsSlice";
import orderReducer from "./slices/orderSlice";

const appReducer = combineReducers({
  cart: cartReducer,
  shop: shopReducer,
  shopProducts: itemsReducer,
  order: orderReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "RESET_APP") {
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
