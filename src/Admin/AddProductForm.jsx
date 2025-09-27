import React, { useState } from "react";
import axios from "axios";
import styles from "./AdminProducts.module.css";

const AddProductForm = ({ onClose, onProductAdded }) => {
  const [newProduct, setNewProduct] = useState({
    id: "",
    title: "",       // changed from name to title
    price: "",
    category: "",
    image: "",
    description: "",
  });

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3000/products", newProduct);
      setNewProduct({
        id: "",
        title: "",
        price: "",
        category: "",
        image: "",
        description: "",
      });
      onProductAdded(); // refresh product list
      onClose(); // close modal
    } catch (err) {
      console.error("Error adding product", err);
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.formContainer}>
        <h2>Add New Product</h2>
        <form onSubmit={addProduct} className={styles.form}>
          <input
            type="text"
            placeholder="ID"
            value={newProduct.id}
            onChange={(e) => setNewProduct({ ...newProduct, id: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Title"
            value={newProduct.title}
            onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Category"
            value={newProduct.category}
            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={newProduct.image}
            onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
            required
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            required
          ></textarea>
          <div className={styles.formActions}>
            <button type="submit">Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProductForm;
