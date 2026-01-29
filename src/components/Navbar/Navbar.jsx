import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaSearch,
  FaSignInAlt,
  FaSignOutAlt,
  FaHeart,
  FaUserCircle,
  FaChevronDown,
  FaChevronUp,
  FaHome,
  FaInfoCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

import { Context as SearchContext } from "../../Context/Search";
import { CountContext } from "../../Context/CountContext";
import API from "../../api/axios";

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { search, setSearch } = useContext(SearchContext);
  const { cartCount, wishlistCount, setCartCount, setWishlistCount } =
    useContext(CountContext);

  const [menuOpen, setMenuOpen] = useState(false);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isLogged = localStorage.getItem("isLoged") === "true";

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ================= FETCH COUNTS ================= */
  useEffect(() => {
    if (!isLogged) return;

    const fetchCounts = async () => {
      try {
        const [cartRes, wishRes] = await Promise.all([
          API.get("/cart/count/"),
          API.get("/wishlist/count/"),
        ]);
        setCartCount(cartRes.data.count);
        setWishlistCount(wishRes.data.count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCounts();
  }, [isLogged, setCartCount, setWishlistCount]);

  /* ================= LOGOUT HANDLER ================= */
  const handleLogout = async () => {
    const refresh = localStorage.getItem("refresh");
    try {
      if (refresh) {
        await API.post("/accounts/logout/", { refresh });
      }
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.clear();
      navigate("/Login", { replace: true });
      setProfileOpen(false);
    }
  };

  const closeAllMenus = () => {
    setMenuOpen(false);
    setCategoryOpen(false);
    setProfileOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path ? "text-indigo-600" : "text-gray-700";
  };

  return (
    <nav className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      isScrolled 
        ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200" 
        : "bg-white"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* LOGO */}
          <div
            onClick={() => { navigate("/Home"); closeAllMenus(); }}
            className="flex items-center cursor-pointer group"
          >
            <div className="relative">
              <span className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-700 bg-clip-text text-transparent">
                VisionX
              </span>
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-600 to-indigo-700 group-hover:w-full transition-all duration-300"></div>
            </div>
          </div>

          {/* DESKTOP NAVIGATION */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            
            {/* Home */}
            <Link
              to="/Home"
              onClick={closeAllMenus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 ${isActive("/Home")}`}
            >
              <FaHome className="w-4 h-4" />
              Home
            </Link>

            {/* About */}
            <Link
              to="/About"
              onClick={closeAllMenus}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 ${isActive("/About")}`}
            >
              <FaInfoCircle className="w-4 h-4" />
              About
            </Link>

            {/* Category Dropdown */}
            <div className="relative">
              <button
                onClick={() => setCategoryOpen(!categoryOpen)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:bg-indigo-50 ${categoryOpen ? "text-indigo-600 bg-indigo-50" : "text-gray-700"}`}
              >
                Category
                {categoryOpen ? <FaChevronUp className="w-3 h-3" /> : <FaChevronDown className="w-3 h-3" />}
              </button>

              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                  <div className="py-2">
                    <Link
                      to="/Sunglasses"
                      onClick={() => { navigate("/Sunglasses"); setCategoryOpen(false); }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                      Sunglasses
                    </Link>
                    <Link
                      to="/Readingglasses"
                      onClick={() => { navigate("/Readingglasses"); setCategoryOpen(false); }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                      Reading Glasses
                    </Link>
                    <Link
                      to="/Computerglasses"
                      onClick={() => { navigate("/Computerglasses"); setCategoryOpen(false); }}
                      className="flex items-center px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      <span className="w-2 h-2 rounded-full bg-indigo-500 mr-3"></span>
                      Computer Glasses
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Search Bar */}
            <div className="relative ml-2">
              <div className="relative">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search eyewear..."
                  className="w-48 lg:w-64 pl-5 pr-10 py-2.5 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all duration-200"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
              </div>
            </div>

            {/* Wishlist */}
            <Link
              to={isLogged ? "/ViewWishList" : "/Login"}
              onClick={closeAllMenus}
              className="relative p-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 group"
            >
              <FaHeart className="w-5 h-5 text-gray-700 group-hover:text-red-500 transition-colors" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to={isLogged ? "/cart" : "/Login"}
              onClick={closeAllMenus}
              className="relative p-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200 group"
            >
              <FaShoppingCart className="w-5 h-5 text-gray-700 group-hover:text-indigo-600 transition-colors" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile / Login */}
            {isLogged ? (
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-indigo-50 transition-all duration-200"
                >
                  <FaUserCircle className="w-6 h-6 text-gray-700" />
                  <FaChevronDown className={`w-3 h-3 transition-transform ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden animate-fadeIn">
                    <div className="py-2">
                      <Link
                        to="/profile"
                        onClick={() => { navigate("/profile"); setProfileOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        My Profile
                      </Link>
                      <Link
                        to="/MyOrders"
                        onClick={() => { navigate("/MyOrders"); setProfileOpen(false); }}
                        className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Orders
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/Login"
                onClick={closeAllMenus}
                className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white px-5 py-2.5 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
              >
                <FaSignInAlt className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            {menuOpen ? <FaTimes className="w-6 h-6 text-gray-700" /> : <FaBars className="w-6 h-6 text-gray-700" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t border-gray-200 mt-2 rounded-b-2xl shadow-lg animate-slideDown">
            <div className="py-4 px-4">
              
              {/* Mobile Navigation Links */}
              <div className="space-y-1 mb-6">
                <Link
                  to="/Home"
                  onClick={closeAllMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive("/Home")}`}
                >
                  <FaHome className="w-5 h-5" />
                  Home
                </Link>
                
                <Link
                  to="/About"
                  onClick={closeAllMenus}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${isActive("/About")}`}
                >
                  <FaInfoCircle className="w-5 h-5" />
                  About
                </Link>
              </div>

              {/* Mobile Category */}
              <div className="mb-6">
                <button
                  onClick={() => setCategoryOpen(!categoryOpen)}
                  className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-gray-50 font-medium"
                >
                  <span>Category</span>
                  {categoryOpen ? <FaChevronUp /> : <FaChevronDown />}
                </button>
                
                {categoryOpen && (
                  <div className="mt-2 ml-4 space-y-2">
                    <Link
                      to="/Sunglasses"
                      onClick={closeAllMenus}
                      className="block px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      Sunglasses
                    </Link>
                    <Link
                      to="/Readingglasses"
                      onClick={closeAllMenus}
                      className="block px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      Reading Glasses
                    </Link>
                    <Link
                      to="/Computerglasses"
                      onClick={closeAllMenus}
                      className="block px-4 py-2.5 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                    >
                      Computer Glasses
                    </Link>
                  </div>
                )}
              </div>

              {/* Mobile Search */}
              <div className="relative mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search eyewear..."
                  className="w-full pl-5 pr-10 py-3 rounded-xl bg-gray-50 border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none"
                />
                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500" />
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <Link
                  to={isLogged ? "/ViewWishList" : "/Login"}
                  onClick={closeAllMenus}
                  className="relative p-3 rounded-xl bg-gray-50 hover:bg-red-50 transition-colors"
                >
                  <FaHeart className="w-6 h-6 text-gray-700" />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                </Link>

                <Link
                  to={isLogged ? "/cart" : "/Login"}
                  onClick={closeAllMenus}
                  className="relative p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors"
                >
                  <FaShoppingCart className="w-6 h-6 text-gray-700" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-indigo-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>

                {isLogged ? (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 transition-colors"
                    >
                      <FaUserCircle className="w-6 h-6 text-gray-700" />
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <FaSignOutAlt className="w-5 h-5" />
                      Logout
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/Login"
                    onClick={closeAllMenus}
                    className="flex items-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-xl font-semibold"
                  >
                    <FaSignInAlt />
                    Login
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Overlay for mobile menu */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeAllMenus}
        ></div>
      )}
    </nav>
  );
};