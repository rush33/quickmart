import { Item } from "@/types/item";
import { ItemsState } from "@/types/itemsState";
import { fetchData, fetchFilteredData } from "@/utils/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { where } from "firebase/firestore";

const initialState: ItemsState = {
  data: [],
  loading: false,
  error: null,
};

// Fetch items by shopId
export const fetchItemsByShopId = createAsyncThunk<Item[], string>(
  "items/fetchByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const itemsData = await fetchFilteredData("items", [
        where("shopId", "==", shopId),
      ]);

      const typedItems: Item[] = itemsData.map((doc: any) => ({
        amount: doc.amount,
        category: doc.catefory,
        description: doc.description,
        image: doc.image,
        itemId: doc.itemId,
        name: doc.name,
        price: doc.price,
        shopId: doc.shopId,
        unit: doc.unit,
      }));

      return typedItems;
    } catch (error) {
      console.error("Error in fetchItemsByShopId:", error);
      return rejectWithValue(error);
    }
  }
);

// Fetch all items (no filters)
export const fetchAllItems = createAsyncThunk<Item[]>(
  "items/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const itemsData = await fetchData("items");

      const typedItems: Item[] = itemsData.map((doc: any) => ({
        amount: doc.amount,
        category: doc.category,
        description: doc.description,
        image: doc.image,
        itemId: doc.itemId,
        name: doc.name,
        price: doc.price,
        shopId: doc.shopId,
        unit: doc.unit,
      }));
      console.log("all items", typedItems)
      return typedItems;
    } catch (error) {
      console.error("Error in fetchAllItems:", error);
      return rejectWithValue(error);
    }
  }
);

// Slice
const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItemsByShopId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchItemsByShopId.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchItemsByShopId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      })

      // handle fetchAllItems cases
      .addCase(fetchAllItems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllItems.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAllItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default itemsSlice.reducer;
