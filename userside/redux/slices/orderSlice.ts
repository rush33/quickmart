import { Order } from "@/types/order";
import { orderState } from "@/types/orderState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  getDoc,
  where,
} from "firebase/firestore";
import { db, fetchFilteredData } from "@/utils/firebase";
import { router } from "expo-router";
import { useDispatch } from "react-redux";
import { clearCart } from "./cartSlice";

const initialState: orderState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[], string>(
  "order/fetchOrders",
  async (userId) => {
    console.log("user id in orders", userId);
    const orders = (await fetchFilteredData("orders", [
      where("userId", "==", userId),
    ])) as any[];
    const typedOrders: Order[] = orders.map((order) => ({
      ...order,
    }));
    console.log(typedOrders);
    return typedOrders;
  }
);

export const placeOrder = createAsyncThunk<
  Order,
  Omit<Order, "orderId" | "createdAt">,
  { rejectValue: string }
>("order/placeOrder", async (orderData, { rejectWithValue }) => {
  try {
    const orderWithTimestamp = {
      ...orderData,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(collection(db, "orders"), orderWithTimestamp);

    await updateDoc(docRef, {
      orderId: docRef.id,
    });

    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    const completeOrder = {
      ...data,
      orderId: docRef.id,
    } as Order;

    router.navigate(`/orders/${docRef.id}`);
    return completeOrder;
  } catch (err: any) {
    console.error("❌ Error placing order:", err.message || err);
    return rejectWithValue("Failed to place order");
  }
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      // Place Order
      .addCase(placeOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Order placement failed";
      });
  },
});

export default orderSlice.reducer;
