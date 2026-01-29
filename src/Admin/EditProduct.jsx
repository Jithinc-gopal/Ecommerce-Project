// src/Admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";
import API from "../api/axios";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    title: "",
    price: "",
    image: "",
    description: "",
    category: "",
  });

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await API.get(`/products/products/${id}/`);
        setProduct({
          title: res.data.title,
          price: res.data.price,
          image: res.data.image,
          description: res.data.description,
          category: res.data.category,
        });
      } catch (err) {
        console.error("Failed to load product", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    API.get("/products/categories/")
      .then((res) => setCategories(res.data))
      .catch(() => {});
  }, []);

  /* =========================
     HANDLE INPUT CHANGE
  ========================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  /* =========================
     UPDATE PRODUCT
  ========================= */
  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/products/products/${id}/`, product);
      navigate("/AdminProducts");
    } catch (err) {
      console.error("Update failed", err);
      alert("Only admin users can update products");
    }
  };

  if (loading) {
    return (
      <>
        <AdminNavbar />
        <AdminSidebar />
        <div className="ml-[260px] mt-24 text-gray-600">
          Loading...
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      {/* PAGE CONTAINER */}
      <div className="ml-[260px] mt-20 px-6 pb-10 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Product
        </h2>

        {/* FORM CARD */}
        <form
          onSubmit={updateProduct}
          className="max-w-2xl bg-white p-8 rounded-xl shadow-md space-y-5"
        >
          {/* TITLE */}
          <input
            type="text"
            name="title"
            value={product.title}
            onChange={handleChange}
            placeholder="Product title"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleChange}
            placeholder="Price"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* CATEGORY */}
          <select
            name="category"
            value={product.category}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* IMAGE */}
          <input
            type="url"
            name="image"
            value={product.image}
            onChange={handleChange}
            placeholder="Image URL"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            value={product.description}
            onChange={handleChange}
            placeholder="Product description"
            rows="4"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => navigate("/AdminProducts")}
              className="px-5 py-2 rounded-lg border border-gray-300
                         text-gray-600 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white
                         hover:bg-blue-700 transition"
            >
              Update Product
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default EditProduct;
