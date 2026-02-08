import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchOrders } from "../../redux/slice/orderSlice";

const STATUS_STYLES = {
  Pending: "badge-warning badge-outline",
  Completed: "badge-success badge-outline",
  Refunded: "badge-error badge-outline",
};

const OrderPage = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    items: orders,
    loading,
    error,
  } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  return (
    <div className="p-8">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fastsaletext">Orders</h1>
        <span className="text-sm text-gray-500">
          Total Orders: {orders.length}
        </span>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-6 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="alert alert-error shadow mb-4">
          Failed to load orders: {error}
        </div>
      )}

      {/* Orders Table */}
      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>Product ID</th>
                <th>Price</th>
                <th>Fee</th>
                <th>Total</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="hover">
                  <td className="font-mono text-sm text-gray-600">
                    {order.product_id}
                  </td>
                  <td>${order.price.toFixed(2)}</td>
                  <td className="text-gray-500">${order.fee.toFixed(2)}</td>
                  <td className="font-semibold">${order.total.toFixed(2)}</td>
                  <td>{order.quantity}</td>
                  <td>
                    <span className={`badge ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}

              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No orders found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
