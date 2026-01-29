// src/Admin/AdminUsers.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminNavbar from "./AdminNavbar";
import AdminSidebar from "./AdminSidebar";
import API from "../api/axios";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  /* =========================
     FETCH USERS
  ========================= */
  const fetchUsers = async () => {
    try {
      const res = await API.get("/custom_admin/users/");
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     TOGGLE USER STATUS
  ========================= */
  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";

    // Optimistic UI
    setUsers((prev) =>
      prev.map((user) =>
        user.id === id ? { ...user, status: newStatus } : user
      )
    );

    try {
      await API.patch(`/custom_admin/users/${id}/status/`, {
        status: newStatus,
      });
    } catch (err) {
      console.error("Failed to update status:", err);
      fetchUsers(); // rollback
    }
  };

  /* =========================
     NAVIGATE TO DETAILS
  ========================= */
  const viewUserDetails = (id) => {
    navigate(`/AdminUsers/${id}`);
  };

  return (
    <>
      <AdminNavbar />
      <AdminSidebar />

      {/* PAGE CONTAINER */}
      <div className="ml-[260px] mt-20 px-6 pb-10 min-h-screen bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Manage Users
        </h2>

        {/* STATES */}
        {loading ? (
          <p className="text-gray-500">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-gray-500">No users found</p>
        ) : (
          /* TABLE WRAPPER (SCROLL ON MOBILE) */
          <div className="overflow-x-auto bg-white rounded-xl shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 text-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left">ID</th>
                  <th className="px-4 py-3 text-left">Username</th>
                  <th className="px-4 py-3 text-left">Email</th>
                  <th className="px-4 py-3 text-left">Orders</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {users.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{user.id}</td>

                    <td
                      onClick={() => viewUserDetails(user.id)}
                      className="px-4 py-3 text-blue-600 cursor-pointer hover:underline font-medium"
                    >
                      {user.username}
                    </td>

                    <td className="px-4 py-3">{user.email}</td>

                    <td className="px-4 py-3">{user.orders_count}</td>

                    {/* STATUS BADGE */}
                    <td className="px-4 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold
                          ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* ACTION */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() =>
                          toggleStatus(user.id, user.status)
                        }
                        className={`px-4 py-1.5 rounded-lg text-white text-xs font-medium transition
                          ${
                            user.status === "Active"
                              ? "bg-red-500 hover:bg-red-600"
                              : "bg-green-500 hover:bg-green-600"
                          }`}
                      >
                        {user.status === "Active" ? "Block" : "Unblock"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminUsers;
