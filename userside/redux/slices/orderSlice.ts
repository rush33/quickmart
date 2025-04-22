import { Order } from "@/types/order";
import { orderState } from "@/types/orderState";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  addDoc,
  collection,
  updateDoc,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";
import { db, fetchData } from "@/utils/firebase";
import { router } from "expo-router"; // or wherever you're using router

const initialState: orderState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk<Order[]>(
  "order/fetchOrders",
  async () => {
    console.log("function called");
    const orders = (await fetchData("orders")) as any[];
    const typedOrders: Order[] = orders.map((order) => ({
      ...order,
    }));
    console.log("typed orders from slice:", typedOrders);
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
      createdAt: serverTimestamp(),
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
        state.data.push(action.payload); // Add the new order to state
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Order placement failed";
      });
  },
});

export default orderSlice.reducer;
