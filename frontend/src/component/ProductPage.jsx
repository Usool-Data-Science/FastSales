import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteProduct, createProduct } from "../../redux/slice/productSlice";

const ProductPage = () => {
  const dispatch = useDispatch();

  const {
    items: products,
    loading,
    error,
  } = useSelector((state) => state.products);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: "",
  });

  const handleDelete = (id) => {
    dispatch(deleteProduct(id));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    // Dispatch the createProduct thunk
    dispatch(
      createProduct({
        name: formData.name,
        price: Number(formData.price),
        quantity: Number(formData.quantity),
      }),
    );

    // Close modal & reset form
    setIsModalOpen(false);
    setFormData({ name: "", price: "", quantity: "" });
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-fastsaletext">Products</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          + Add Product
        </button>
      </div>

      {/* Loading / Error / Table */}
      {loading && <div className="p-4">Loading...</div>}
      {error && <div className="alert alert-error shadow">{error}</div>}

      {!loading && !error && (
        <div className="overflow-x-auto rounded-lg bg-white shadow">
          <table className="table w-full">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th>Name</th>
                <th>Price</th>
                <th>Stock</th>
                <th className="text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product.id} className="hover">
                  <td className="font-medium">{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    {product.quantity > 0 ? (
                      <span className="badge badge-success badge-outline">
                        In stock ({product.quantity})
                      </span>
                    ) : (
                      <span className="badge badge-error badge-outline">
                        Out of stock
                      </span>
                    )}
                  </td>
                  <td className="text-center">
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-error btn-outline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500">
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Product Modal */}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-semibold text-lg mb-4">Add New Product</h3>

            <div className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Product name"
                className="input input-bordered w-full"
                value={formData.name}
                onChange={handleChange}
              />
              <input
                type="number"
                name="price"
                placeholder="Price"
                className="input input-bordered w-full"
                value={formData.price}
                onChange={handleChange}
              />
              <input
                type="number"
                name="quantity"
                placeholder="Quantity"
                className="input input-bordered w-full"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>

            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleAddProduct}>
                Add Product
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
