import React, { useState } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import styles from "./AdminNavbar.module.css";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("email");
    localStorage.removeItem("role")
    localStorage.removeItem("isLoged")
    navigate("/login");
  };

  return (
    <nav className={styles.navbar}>
      {/* Hamburger */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <FaBars />
      </div>

      {/* Title */}
      <div className={styles.navTitle}>Admin Dashboard</div>

      {/* User Section */}
      <div className={styles.userSection}>
        <FaUserCircle className={styles.userIcon} onClick={() => setShowMenu(!showMenu)} />
        {showMenu && (
          <div className={styles.dropdown}>
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
