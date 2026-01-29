import React, { useState } from "react";
import {
  FaBars,
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaTachometerAlt,
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Hamburger (mobile) */}
      <div
        className="fixed top-4 left-4 z-50 text-2xl text-yellow-400 cursor-pointer md:hidden"
        onClick={toggleSidebar}
      >
        <FaBars />
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-black text-yellow-400 shadow-xl
        transition-all duration-300
        ${isOpen ? "w-64" : "w-20"}
        hidden md:block`}
      >
        {/* Logo */}
        <h1 className="text-xl font-bold text-center py-6 border-b border-yellow-400">
          {isOpen ? "Admin Panel" : "AP"}
        </h1>

        {/* Menu */}
        <ul className="mt-6 space-y-2 px-3">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/Admin"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-yellow-400 hover:text-black"
                }`
              }
            >
              <FaTachometerAlt className="text-lg" />
              {isOpen && <span>Dashboard</span>}
            </NavLink>
          </li>

          {/* Products */}
          <li>
            <NavLink
              to="/AdminProducts"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-yellow-400 hover:text-black"
                }`
              }
            >
              <FaBox className="text-lg" />
              {isOpen && <span>Products</span>}
            </NavLink>
          </li>

          {/* Users */}
          <li>
            <NavLink
              to="/AdminUsers"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-yellow-400 hover:text-black"
                }`
              }
            >
              <FaUsers className="text-lg" />
              {isOpen && <span>Users</span>}
            </NavLink>
          </li>

          {/* Orders */}
          <li>
            <NavLink
              to="/AdminOrders"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg transition
                ${
                  isActive
                    ? "bg-yellow-400 text-black"
                    : "hover:bg-yellow-400 hover:text-black"
                }`
              }
            >
              <FaShoppingCart className="text-lg" />
              {isOpen && <span>Orders</span>}
            </NavLink>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default AdminSidebar;
