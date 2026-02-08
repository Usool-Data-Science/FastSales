import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import LandingLayout from "./component/LandingLayout";
import ProductPage from "./component/ProductPage";
import OrderPage from "./component/OrderPage";
import ErrorPage from "./component/ErrorPage";
import store from "../redux/store";
import { Provider } from "react-redux";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<LandingLayout />}>
            <Route index path="/products" element={<ProductPage />} />
            <Route path="/orders" element={<OrderPage />} />
          </Route>
          <Route
            path="*"
            element={<ErrorPage message="Page not found." />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
