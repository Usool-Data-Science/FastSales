import { configureStore } from "@reduxjs/toolkit";
import productReducer from "./slice/productSlice";
import orderReducer from "./slice/orderSlice";
const store = configureStore({
  reducer: {
    products: productReducer,
    orders: orderReducer,
  },
});

export default store;
