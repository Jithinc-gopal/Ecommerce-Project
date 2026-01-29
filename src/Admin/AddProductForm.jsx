import React, { useEffect, useState } from "react";
import API from "../api/axios";

const AddProductForm = ({ onClose, onProductAdded }) => {
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    image: "",
    category: "",
  });

  /* =========================
     FETCH CATEGORIES
  ========================= */
  useEffect(() => {
    API.get("/products/categories/")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category load failed", err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  /* =========================
     SUBMIT FORM
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/products/products/", {
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        image: formData.image,
        category: Number(formData.category),
      });

      onProductAdded();
      onClose();
    } catch (err) {
      console.error("Add product failed", err.response?.data);
      alert("Check all fields");
    }
  };

  return (
    /* OVERLAY */
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      {/* MODAL */}
      <div className="bg-white w-full max-w-lg rounded-xl shadow-xl p-6">
        <h2 className="text-2xl font-bold text-black mb-6">
          Add <span className="text-yellow-500">Product</span>
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TITLE */}
          <input
            name="title"
            placeholder="Product Title"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* DESCRIPTION */}
          <textarea
            name="description"
            placeholder="Product Description"
            rows="3"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* PRICE */}
          <input
            type="number"
            name="price"
            placeholder="Price"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* IMAGE */}
          <input
            name="image"
            placeholder="Image URL"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* CATEGORY */}
          <select
            name="category"
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-yellow-400 text-black font-semibold hover:bg-yellow-500 transition"
            >
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
