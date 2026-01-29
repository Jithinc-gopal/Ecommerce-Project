import React, { useEffect, useState } from "react";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import AddProductForm from "./AddProductForm";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const AdminProducts = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);

  /* =========================
     FETCH PRODUCTS
  ========================= */
  const fetchProducts = async () => {
    try {
      const res = await API.get("/products/products/");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  /* =========================
     DELETE PRODUCT
  ========================= */
  const deleteProduct = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await API.delete(`/products/products/${id}/`);
      fetchProducts();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Only admin users can delete products");
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      {/* MAIN CONTENT */}
      <div className="md:ml-64 p-6 bg-gray-100 min-h-screen">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-black">
            Manage <span className="text-yellow-500">Products</span>
          </h2>

          <button
            onClick={() => setShowForm(true)}
            className="mt-4 md:mt-0 bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            + Add Product
          </button>
        </div>

        {/* ADD PRODUCT MODAL */}
        {showForm && (
          <AddProductForm
            onClose={() => setShowForm(false)}
            onProductAdded={fetchProducts}
          />
        )}

        {/* TABLE */}
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="w-full text-sm text-left">
            <thead className="bg-black text-yellow-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Title</th>
                <th className="px-4 py-3">Price (₹)</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Image</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3 text-center">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td
                    colSpan="7"
                    className="text-center py-6 text-gray-500"
                  >
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((p) => (
                  <tr
                    key={p.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{p.id}</td>
                    <td className="px-4 py-3 font-medium">{p.title}</td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">{p.category_name}</td>
                    <td className="px-4 py-3">
                      <img
                        src={p.image}
                        alt={p.title}
                        className="w-14 h-14 object-cover rounded"
                      />
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-xs truncate">
                      {p.description.slice(0, 60)}...
                    </td>
                    <td className="px-4 py-3 text-center space-x-2">
                      <button
                        onClick={() =>
                          navigate(`/AdminProducts/edit/${p.id}`)
                        }
                        className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default AdminProducts;
