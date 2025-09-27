import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./AdminOrders.module.css";
import AdminNavbar from "./Adminnavbar";
import AdminSidebar from "./AdminSidebar";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const res = await axios.get("http://localhost:3000/user"); // your users.json
        const users = res.data;

        // Flatten all orders into one list
        const allOrders = users.flatMap((u) =>
          (u.orders || []).map((o) => ({
            ...o,
            userEmail: u.email,
            userId: u.id, // keep userId for updating later
          }))
        );

        setOrders(allOrders);
      } catch (err) {
        console.log("Error fetching orders:", err);
      }
    }
    fetchOrders();
  }, []);

  const toggleStatus = async (orderId, userId) => {
    // Update frontend state
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId && o.userId === userId
          ? { ...o, status: o.status === "Delivered" ? "Pending" : "Delivered" }
          : o
      )
    );

    try {
      // Get the user to update their orders
      const res = await axios.get(`http://localhost:3000/user/${userId}`);
      const user = res.data;

      const updatedOrders = user.orders.map((o) =>
        o.id === orderId
          ? { ...o, status: o.status === "Delivered" ? "Pending" : "Delivered" }
          : o
      );

      // Update user with modified orders
      await axios.patch(`http://localhost:3000/user/${userId}`, {
        orders: updatedOrders,
      });
    } catch (err) {
      console.log("Error updating order status:", err);
    }
  };

  return (<>
  <AdminNavbar/>
  <AdminSidebar/>
    <div className={styles.ordersContainer}>
      <h2 className={styles.title}>Manage Orders</h2>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User Email</th>
            <th>Product</th>
            <th>Image</th>
            <th>Price</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {orders.length > 0 ? (
            orders.map((o) => (
              <tr key={`${o.userId}-${o.id}`}>
                <td>{o.id}</td>
                <td>{o.userEmail}</td>
                <td>{o.title}</td>
                <td>
                  <img
                    src={o.image}
                    alt={o.name}
                    style={{ width: "60px", borderRadius: "6px" }}
                  />
                </td>
                <td>₹{o.price}</td>
                <td
                  className={
                    o.status === "Delivered"
                      ? styles.statusDelivered
                      : styles.statusPending
                  }
                >
                  {o.status}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(o.id, o.userId)}
                    className={`${styles.actionBtn} ${
                      o.status === "Delivered"
                        ? styles.pendingBtn
                        : styles.deliveredBtn
                    }`}
                  >
                    {o.status === "Delivered"
                      ? "Mark Pending"
                      : "Mark Delivered"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="7" style={{ textAlign: "center" }}>
                No orders found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};
