import React, { useState } from "react";
import { FaBars, FaBox, FaUsers, FaShoppingCart, FaTachometerAlt } from "react-icons/fa";
import styles from "./AdminSidebar.module.css";
// import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
// import { FaTachometerAlt, FaBox } from "react-icons/fa";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Hamburger for mobile */}
      <div className={styles.hamburger} onClick={toggleSidebar}>
        <FaBars />
      </div>

      <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
        <h1 className={styles.logo}>Admin Panel</h1>
        <ul className={styles.menu}>
         
<li>
  <NavLink 
    to="/Admin" 
    className={({ isActive }) => 
      `${styles.menuLink} ${isActive ? styles.active : ""}`
    }
  >
    <FaTachometerAlt className={styles.icon} />
    {isOpen && <span>Dashboard</span>}
  </NavLink>
</li>

<li>
  <NavLink 
    to="/AdminProducts" 
    className={({ isActive }) => 
      `${styles.menuLink} ${isActive ? styles.active : ""}`
    }
  >
    <FaBox className={styles.icon} />
    {isOpen && <span>Products</span>}
  </NavLink>
</li>
        <li>
  <NavLink 
    to="/AdminUsers" 
    className={({ isActive }) => 
      `${styles.menuLink} ${isActive ? styles.active : ""}`
    }
  >
    <FaUsers className={styles.icon} />
    {isOpen && <span>Users</span>}
  </NavLink>
</li>

<li>
  <NavLink 
    to="/AdminOrders" 
    className={({ isActive }) => 
      `${styles.menuLink} ${isActive ? styles.active : ""}`
    }
  >
    <FaShoppingCart className={styles.icon} />
    {isOpen && <span>Orders</span>}
  </NavLink>
</li>

        </ul>
      </div>
    </>
  );
};

export default AdminSidebar;
