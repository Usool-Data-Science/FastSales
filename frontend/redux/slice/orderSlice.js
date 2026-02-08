import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_PAYMENT_URL = import.meta.env.VITE_PUBLIC_PAYMENT_URL;

const initialState = {
  items: [],
  loading: false,
  error: null,
};

/* =======================
   FETCH ORDERS
======================= */
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_PAYMENT_URL}/orders`);
      return response.data; // should be array of orders
    } catch (error) {
      return rejectWithValue(
        error.response?.data || error.message || "Failed to fetch orders",
      );
    }
  },
);

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH ORDERS */
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to load orders";
      });
  },
});

export default orderSlice.reducer;
