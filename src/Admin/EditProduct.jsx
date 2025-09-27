// src/Admin/EditProduct.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./EditProduct.module.css";
import AdminSidebar from "./AdminSidebar";

const EditProduct = () => {
  const { id } = useParams(); // old id from URL
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:3000/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.error("Error fetching product", err));
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      //  if ID has changed, delete old product and create new one
      if (product.id.toString() !== id.toString()) {
        await axios.delete(`http://localhost:3000/products/${id}`);
        await axios.post("http://localhost:3000/products", product);
      } else {
        await axios.put(`http://localhost:3000/products/${id}`, product);
      }

      navigate("/AdminProducts"); // back to product list
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  if (!product) return <p>Loading...</p>;

  return (<>
    <AdminSidebar/>
    <div className={styles.editContainer}>
      <h2>Edit Product</h2>
      <form onSubmit={updateProduct} className={styles.form}>
        <input
          type="text"
          name="id"
          value={product.id}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="title"
          value={product.title}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="category"
          value={product.category}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <input
          type="text"
          name="image"
          value={product.image}
          onChange={handleChange}
          className={styles.input}
          required
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          className={styles.textarea}
          required
        ></textarea>

        <div className={styles.formActions}>
          <button type="submit" className={styles.saveBtn}>
            Update
          </button>
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => navigate("/AdminProducts")}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditProduct;
