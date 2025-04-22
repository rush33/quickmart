import { Item } from "@/types/item";
import { ItemsState } from "@/types/itemsState";
import { fetchFilteredData } from "@/utils/firebase";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { where } from "firebase/firestore";

const initialState: ItemsState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchItemsByShopId = createAsyncThunk<Item[], string>(
  "items/fetchByShopId",
  async (shopId, { rejectWithValue }) => {
    try {
      const itemsData = await fetchFilteredData("items", [
        where("shopId", "==", shopId),
      ]);

      const typedItems: Item[] = itemsData.map((doc: any) => ({
        itemId: doc.itemId,
        amount: doc.amount,
        description: doc.description,
        image: doc.image,
        name: doc.name,
        price: doc.price,
        shelfLife: doc.shelfLife,
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

const itemsSlice = createSlice({
  name: "shop",
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
      });
  },
});

export default itemsSlice.reducer;
