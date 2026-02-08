import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_INVENTORY_URL = import.meta.env.VITE_PUBLIC_INVENTORY_URL;
console.log(BASE_INVENTORY_URL);
const initialState = {
  items: [],
  loading: false,
  error: null,
};

/* =======================
   FETCH PRODUCTS
======================= */
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_INVENTORY_URL}/products`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch products",
      );
    }
  },
);

/* =======================
   CREATE PRODUCT
======================= */
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (newProduct, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${BASE_INVENTORY_URL}/products`,
        newProduct,
      );
      return response.data; // backend returns the created product with id
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  },
);

/* =======================
   DELETE PRODUCT
======================= */
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (productId, { rejectWithValue }) => {
    try {
      await axios.delete(`${BASE_INVENTORY_URL}/products/${productId}`);
      return productId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to delete product",
      );
    }
  },
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      /* FETCH */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload ?? [];
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to retrieve products";
      })

      /* DELETE */
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(
          (product) => product.id !== action.payload,
        );
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product";
      })
      /* CREATE PRODUCT */
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items.push(action.payload); // add new product to array
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product";
      });
  },
});

export default productSlice.reducer;
