import React, { useEffect, useState } from "react";
import API from "../api/axios";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";

export const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  // ✅ FETCH ALL ORDERS
  const fetchOrders = async () => {
    try {
      const res = await API.get("/custom_admin/orders/");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to load orders", err.response?.data);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATE ORDER STATUS (DB + UI)
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);

      const res = await API.patch(
        `/custom_admin/orders/${orderId}/status/`,
        { status: newStatus }
      );

      // 🔄 Instant UI update
      setOrders((prev) =>
        prev.map((order) =>
          order.order_id === orderId
            ? { ...order, status: res.data.status }
            : order
        )
      );
    } catch (err) {
      console.error("Status update failed", err.response?.data);
      alert(err.response?.data?.detail || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      <div className="md:ml-64 pt-20 px-6 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">
          Manage Orders
        </h2>

        {loading ? (
          <p className="text-gray-600">Loading orders...</p>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow-lg">
            <table className="min-w-full text-sm">
              <thead className="bg-black text-yellow-400">
                <tr>
                  <th className="px-4 py-3 text-left">Order ID</th>
                  <th className="px-4 py-3 text-left">User</th>
                  <th className="px-4 py-3 text-left">Products</th>
                  <th className="px-4 py-3 text-left">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {orders.length > 0 ? (
                  orders.map((order) => (
                    <tr key={order.order_id} className="hover:bg-gray-50">
                      {/* ORDER ID */}
                      <td className="px-4 py-3 font-semibold">
                        #{order.order_id}
                      </td>

                      {/* USER */}
                      <td className="px-4 py-3">
                        <p className="font-medium">{order.user}</p>
                      </td>

                      {/* PRODUCTS */}
                      <td className="px-4 py-3 space-y-2">
                        {order.items?.map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3"
                          >
                            <img
                              src={item.product_image}
                              alt={item.product_title}
                              className="w-12 h-12 rounded-md object-cover border"
                            />
                            <span>
                              {item.product_title} ×{" "}
                              <strong>{item.quantity}</strong>
                            </span>
                          </div>
                        ))}
                      </td>

                      {/* TOTAL */}
                      <td className="px-4 py-3 font-semibold">
                        ₹{order.total_price}
                      </td>

                      {/* STATUS */}
                      <td className="px-4 py-3">
                        {order.status === "pending" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                            Pending
                          </span>
                        )}
                        {order.status === "delivered" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                            Delivered
                          </span>
                        )}
                        {order.status === "cancelled" && (
                          <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                            Cancelled
                          </span>
                        )}
                      </td>

                      {/* ACTION */}
                      <td className="px-4 py-3">
                        {order.status === "pending" ? (
                          <button
                            disabled={updatingId === order.order_id}
                            onClick={() =>
                              updateOrderStatus(order.order_id, "delivered")
                            }
                            className="bg-green-600 hover:bg-green-700 disabled:bg-green-300 text-white px-4 py-2 rounded-lg text-xs"
                          >
                            {updatingId === order.order_id
                              ? "Updating..."
                              : "Mark Delivered"}
                          </button>
                        ) : (
                          <button
                            disabled
                            className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg text-xs cursor-not-allowed"
                          >
                            {order.status}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-6">
                      No orders found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};
