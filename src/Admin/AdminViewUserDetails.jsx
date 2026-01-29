import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import API from "../api/axios";

const AdminViewUserDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserDetails();
  }, [id]);

  const fetchUserDetails = async () => {
    try {
      const res = await API.get(`/custom_admin/users/${id}/`);
      setUser(res.data);
    } catch (err) {
      console.error("Error fetching user details:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* FIXED LAYOUT COMPONENTS */}
      <AdminNavbar />
      <AdminSidebar />

      {/* PAGE CONTENT */}
      <div className="ml-[250px] mt-[60px] min-h-screen bg-gray-100 p-4 md:p-6">
        {loading ? (
          <p className="text-gray-500">Loading user details...</p>
        ) : !user ? (
          <p className="text-red-500">User not found</p>
        ) : (
          <>
            {/* Back Button */}
            <button
              onClick={() => navigate(-1)}
              className="mb-5 px-4 py-2 rounded-md bg-gray-200 hover:bg-gray-300 text-sm font-medium transition"
            >
              ← Back
            </button>

            {/* USER DETAILS CARD */}
            <div className="bg-white rounded-xl shadow border p-6 mb-6">
              <h2 className="text-xl font-semibold mb-5 text-gray-800">
                User Details
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 text-sm">
                <Info label="User ID" value={user.id} />
                <Info label="Username" value={user.username} />
                <Info label="Email" value={user.email} />
                <Info label="Role" value={user.role} />
                <div>
                  <p className="text-gray-500 font-medium mb-1">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {user.status}
                  </span>
                </div>
                <Info
                  label="Joined"
                  value={new Date(user.date_joined).toLocaleString()}
                />
              </div>
            </div>

            {/* ORDERS */}
            <div className="bg-white rounded-xl shadow border p-6">
              <h3 className="text-lg font-semibold mb-4 text-gray-800">
                Orders
              </h3>

              {user.orders.length === 0 ? (
                <p className="text-gray-500 text-sm">
                  No orders found for this user.
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-sm">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <Th>Order ID</Th>
                        <Th>Items</Th>
                        <Th>Total</Th>
                        <Th>Status</Th>
                        <Th>Created At</Th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.orders.map(order => (
                        <tr
                          key={order.id}
                          className="border-b hover:bg-gray-50"
                        >
                          <Td>{order.id}</Td>
                          <Td>
                            {order.items.map(item => (
                              <div key={item.id}>
                                {item.product_title} × {item.quantity}
                              </div>
                            ))}
                          </Td>
                          <Td className="font-semibold">
                            ₹{order.final_amount}
                          </Td>
                          <Td>
                            <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700 font-semibold">
                              {order.status}
                            </span>
                          </Td>
                          <Td>
                            {new Date(order.created_at).toLocaleString()}
                          </Td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

/* SMALL REUSABLE COMPONENTS */
const Info = ({ label, value }) => (
  <div>
    <p className="text-gray-500 font-medium mb-1">{label}</p>
    <p className="text-gray-800">{value}</p>
  </div>
);

const Th = ({ children }) => (
  <th className="px-4 py-3 text-left text-gray-600 font-medium">
    {children}
  </th>
);

const Td = ({ children, className = "" }) => (
  <td className={`px-4 py-3 ${className}`}>{children}</td>
);

export default AdminViewUserDetails;
