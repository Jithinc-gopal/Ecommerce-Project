import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FaShoppingCart, FaSearch, FaSignInAlt, FaSignOutAlt, FaHeart } from "react-icons/fa";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import {  FaClipboardList } from "react-icons/fa";

import { Context } from "./Search";
import axios from "axios";

export const Navbar = () => {
  const { search, setSearch } = useContext(Context);
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);       // hamburger
  const [categoryOpen, setCategoryOpen] = useState(false); // category dropdown
  const [wishlistCount, setWishlistCount] = useState(0);
  const [cartCount, setCartCount] = useState(0);

  const email = localStorage.getItem("email");

  useEffect(()=>{
    if(!email)return;
    axios.get(`http://localhost:3000/user?email=${email}`)
    .then((res)=>{
      const user = res.data[0]
      setWishlistCount(user.WishList?user.WishList.length:0)
      setCartCount(user.cart ? user.cart.length : 0);  // 
    })
    .catch((err)=>console.log("error occuerd in fetchin wishlist",err))
  },[email])


  

  const isloged = localStorage.getItem("isLoged") === "true"
  // const log = localStorage.getItem("Log") === "true";

  const handleLogout = () => {
    localStorage.removeItem("isLoged");
    localStorage.removeItem("email");
      localStorage.clear();
    navigate("/Login", { replace: true });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("search...");
    setSearch("");
  };

  return (
    <nav className={styles.navbar}>
      {/* Logo */}
      <div className={styles.logo}>👓 Eyewear</div>

      {/* Hamburger */}
      <div
        className={styles.hamburger}
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? "✖" : "☰"}
      </div>

      {/* Menu Links */}
      <ul className={`${styles.navLinks} ${menuOpen ? styles.active : ""}`}>
        <li>
          <Link to="/Home" onClick={() => setMenuOpen(false)}>Home</Link>
        </li>
        <li>
          <Link to="/About" onClick={() => setMenuOpen(false)}>About</Link>
        </li>

        {/* Category Dropdown */}
        <li
          className={styles.dropdown}
          onClick={() => setCategoryOpen(!categoryOpen)}
        >
         <span className={styles.dropbtn}>
  Category {categoryOpen ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
</span>
          {categoryOpen && (
            <ul className={styles.dropdownMenu}>
              <li>
                <Link to="/Sunglasses" onClick={() => setMenuOpen(false)}>Sunglasses</Link>
              </li>
              <li>
                <Link to="/Readingglasses" onClick={() => setMenuOpen(false)}>Reading Glasses</Link>
              </li>
              <li>
                <Link to="/Computerglasses" onClick={() => setMenuOpen(false)}>Computer Glasses</Link>
              </li>
            </ul>
          )}
        </li>

        {/* Search */}
        <li className={styles.searchBox}>
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Search eyewear..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button type="submit"><FaSearch /></button>
          </form>
        </li> 
   <li>
          <Link
            to={isloged ? "/MyOrders" : "/Login"}
            className={styles.icon}
            onClick={() => setMenuOpen(false)}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 6 }}
          >
            <FaClipboardList size={20} style={{   color: "#007bff" }} />
            <span className={styles.iconLabel}>My Orders</span>
          </Link>
        </li>


       <Link 
  to={isloged ? "/ViewWishList" : "/Login"} 
  className={styles.icon} 
  onClick={() => setMenuOpen(false)}
  style={{ position: "relative" }}
>
  <FaHeart size={22} style={{color:"#8B0000"}}/>
  {/* {wishlistCount > 0 && (
    <span style={{
      position: "absolute",
      top: -6,
      right: -6,
      background: "tomato",
      color: "#fff",
      borderRadius: "70%",
      padding: "2px 6px",
      fontSize: "0.7rem",
      fontWeight: "bold"
    }}>
      {wishlistCount}
    </span>
  )} */}
</Link>
        {/* Cart */}
       <li>
  <Link
    to={isloged ? "/cart" : "/Login"}
    className={styles.icon}
    onClick={() => setMenuOpen(false)}
    style={{ position: "relative" }}
  >
    <FaShoppingCart  style={{color:" #007bff"}}size={22} />
    {cartCount > 0 && (
      <span
        style={{
          position: "absolute",
          top: -13,
          right: -6,
          background: "red",
          color: "#fff",
          borderRadius: "50%",
          padding: "2px 6px",
          fontSize: "0.7rem",
          fontWeight: "bold",
        }}
      >
        {cartCount}
      </span>
    )}
  </Link>
</li>


        {/* Login / Logout */}
        <li>
          { isloged ? (
            <button onClick={handleLogout} className={styles.logoutBtn}>
              <FaSignOutAlt /> Logout
            </button>
          ) : (
            <Link to="/Login" className={styles.loginBtn} onClick={() => setMenuOpen(false)}>
              <FaSignInAlt /> Login
            </Link>
          )}
        </li>
      </ul>
    </nav>
  );
};
