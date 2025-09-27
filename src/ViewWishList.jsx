import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Navbar } from './Navbar'
import styles from "./WishList.module.css"; // import css module
import { FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { Context } from './Search';
import Cart from './Cart';

export const ViewWishList = () => {
    const { search,wishlist,setWishlist,cartItems,setCartItems } = useContext(Context);
  
  const navigate = useNavigate()
    const email = localStorage.getItem("email")

    const [WishList,setWishList] = useState([])

  useEffect(()=>{
        axios.get(`http://localhost:3000/user?email=${email}`)
        .then((res)=>{
            const user = res.data[0]
            const userWishList = user.WishList||[]
            setWishList(userWishList)
        })
        .catch((err)=>console.log("email not found",err))
    },[email])

      const handleDelete = async (id) => {
    try {
      // Remove from state
      const updatedList = WishList.filter((item) => item.id !== id)
      setWishList(updatedList)

      // Update in db.json
      const res = await axios.get(`http://localhost:3000/user?email=${email}`)
      const user = res.data[0]
      await axios.patch(`http://localhost:3000/user/${user.id}`, {
        WishList: updatedList,
      })
    } catch (error) {
      console.error("Error deleting wishlist item", error)
    }
  }
    const stopprop = (e) => e.stopPropagation();

const handleAddToCart = async (product) => {
  await Cart(product); // call your existing cart function
  // Update local cartItems state after adding
  const res = await axios.get(`http://localhost:3000/user?email=${email}`);
  setCartItems(res.data[0].cart || []);
};

   return (<>
      <Navbar/>
      <div className={styles.container}>
        {WishList.map((product) => (
          <div key={product.id} className={styles.card}>
            <img
              src={product.image}
              alt={product.title}
              className={styles.image}
            />
            <div className={styles.content}>
              <h3 className={styles.title}>{product.title}</h3>
              <p className={styles.price}>₹{product.price}</p>
                <FaTrash 
                  onClick={() => handleDelete(product.id)} 
                  className={styles.deleteIcon} 
                />
                   <button
                  onClick={(e) => {
                    stopprop(e);
                      if (!email) {
                      // user not logged in → go to login page
                      navigate("/login");
                      return;
                    }
                    const inCart = cartItems.some((item) => item.id === product.id);
                    if (inCart) {
                      navigate("/cart"); // Go to cart page
                    } else {
                      handleAddToCart(product); // Add to cart
                    }
                    
                  }}
                  className={styles.button}
                >
                  {cartItems.some((item) => item.id === product.id) ? "Go to Cart" : "Add to Cart"}
                </button>
                {/* <button
                  onClick={(e) => {
                    stopprop(e);
                    // Save product temporarily in localStorage for checkout
                    // localStorage.setItem("buyNowProduct", JSON.stringify(product));
                    navigate("/OrderForm"); // navigate to order form page
                  }}
                  className={styles.buyNowButton}
                >
                  Buy Now
                </button> */}
            </div>
          
          </div>
          
        ))}
      </div>
      </>
    );
}
