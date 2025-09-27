import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AdminProducts.module.css";
import AdminNavbar from "./Adminnavbar";
import AdminSidebar from "./AdminSidebar";
import AddProductForm from "./AddProductForm";
import { useNavigate } from "react-router-dom";

const AdminProducts = () => {
  const navigate  = useNavigate()
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // Fetch products
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3000/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products", err);
    }
  };

  // Delete product
  const deleteProduct = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product", err);
    }
  };

  // Edit product
  const startEdit = (product) => {
    setEditingProduct(product);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/products/${editingProduct.id}`, editingProduct);
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Error updating product", err);
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />
      <div className={styles.productsContainer}>
        <h2 className={styles.title}>Manage Products</h2>

        {/* Add Product Button */}
        <button className={styles.addBtn} onClick={() => setShowForm(true)}>
          + Add Product
        </button>

        {/* Add Product Form Modal */}
        {showForm && (
          <AddProductForm
            onClose={() => setShowForm(false)}
            onProductAdded={fetchProducts}
          />
        )}

        {/* Product List */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price ($)</th>
              <th>Category</th>
              <th>Image</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) =>
              editingProduct && editingProduct.id === p.id ? (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.title}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, name: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, price: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.category}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, category: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={editingProduct.image}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, image: e.target.value })
                      }
                    />
                  </td>
                  <td>
                    <textarea
                      value={editingProduct.description}
                      onChange={(e) =>
                        setEditingProduct({ ...editingProduct, description: e.target.value })
                      }
                    ></textarea>
                  </td>
                  <td>
                    <button onClick={updateProduct}>Save</button>
                    <button  onClick={() => setEditingProduct(null)}>Cancel</button>
                  </td>
                </tr>
              ) : (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.title}</td>
                  <td>{p.price}</td>
                  <td>{p.category}</td>
                  <td>
                    <img src={p.image} alt={p.name} width="60" />
                  </td>
                  <td>{p.description}</td>
                  <td>
                   <button className={styles.edtbtn} onClick={() => navigate(`/AdminProducts/edit/${p.id}`)}>Edit</button>
                    <button  onClick={() => deleteProduct(p.id)}>Delete</button>
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AdminProducts;
