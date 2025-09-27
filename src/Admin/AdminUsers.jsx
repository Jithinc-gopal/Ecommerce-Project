import axios from "axios";
import React, { useEffect, useState } from "react";
import styles from "./AdminUsers.module.css"; // ✅ import CSS file
import AdminNavbar from "./Adminnavbar";
import AdminSidebar from "./AdminSidebar";

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetch() {
      try {
        const userData = await axios.get("http://localhost:3000/user");
        setUsers(userData.data);
      } catch (err) {
        console.log("Error occurred in fetching user", err);
      }
    }
    fetch();
  }, []);

  const toggleStatus = async (id) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    const newStatus = user.status === "Active" ? "Inactive" : "Active";

    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );

    try {
      await axios.patch(`http://localhost:3000/user/${id}`, {
        status: newStatus,
      });
    } catch (err) {
      console.log("Error occurred in updating status", err);
    }
  };

  return (<>
  <AdminNavbar/>
  <AdminSidebar/>
<div className={styles.usersContainer}>
  <h2 className={styles.title}>Manage Users</h2>
  <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Orders</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.username}</td>
                <td>{u.email}</td>
                <td>{u.orders?.length || 0}</td>
                <td
                  className={
                    u.status === "Active"
                      ? styles["status-active"]
                      : styles["status-inactive"]
                  }
                >
                  {u.status}
                </td>
                <td>
                  <button
                    onClick={() => toggleStatus(u.id)}
                    className={`${styles.actionBtn} ${
                      u.status === "Active"
                        ? styles.blockBtn
                        : styles.unblockBtn
                    }`}
                  >
                    {u.status === "Active" ? "Block" : "Unblock"}
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: "center" }}>
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </>
  );
};
