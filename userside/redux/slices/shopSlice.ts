import { Shop } from "@/types/shop";
import { ShopState } from "@/types/shopState";
import { fetchData } from "@/utils/firebaseConfig";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState: ShopState = {
  data: [],
  loading: false,
  error: null,
};

export const fetchShops = createAsyncThunk("shop/fetchShops", async () => {
  const shopsData = (await fetchData("shops")) as any[];
  const typedShops: Shop[] = shopsData.map((shop) => ({
    id: shop.id,
    name: shop.name || "",
    image: shop.image || "",
    rating: Number(shop.rating) || 0,
    address: shop.address || "",
    genre: Array.isArray(shop.genre) ? shop.genre : [],
    lat: Number(shop.lat) || 0,
    lng: Number(shop.lng) || 0,
  }));
  return typedShops;
});

const shopSlice = createSlice({
  name: "shop",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchShops.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchShops.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchShops.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export default shopSlice.reducer;
