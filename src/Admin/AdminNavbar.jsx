import React, { useState } from "react";
import { FaBars, FaUserCircle, FaSignOutAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminNavbar = ({ toggleSidebar }) => {
  const [showMenu, setShowMenu] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("isLoged");

    navigate("/login");
  };

  return (
    <nav className="flex items-center justify-between bg-black text-yellow-400 px-6 py-4 shadow-lg relative">
      {/* Hamburger */}
      <div
        className="text-2xl cursor-pointer hover:text-yellow-300"
        onClick={toggleSidebar}
      >
        <FaBars />
      </div>

      {/* Title */}
      <h1 className="text-xl font-bold tracking-wide">
        Admin Dashboard
      </h1>

      {/* User Section */}
      <div className="relative">
        <FaUserCircle
          className="text-3xl cursor-pointer hover:text-yellow-300"
          onClick={() => setShowMenu(!showMenu)}
        />

        {showMenu && (
          <div className="absolute right-0 mt-3 w-40 bg-black border border-yellow-400 rounded-lg shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-4 py-2 text-yellow-400 hover:bg-yellow-400 hover:text-black rounded-lg transition"
            >
              <FaSignOutAlt />
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
