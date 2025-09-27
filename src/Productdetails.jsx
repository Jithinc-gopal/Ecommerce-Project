import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Navbar } from "./Navbar";
import Cart from "./Cart";
import styles from "./Productdetails.module.css";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { Context } from "./Search";

export const Productdetails = () => {
    const { search,wishlist,setWishlist,cartItems,setCartItems } = useContext(Context);
  

  const navigate = useNavigate()
  const { id } = useParams();
  const [detail, setDetail] = useState({});
    const email = localStorage.getItem("email");


  useEffect(() => {
    axios.get(`http://localhost:3000/products/${id}`)
      .then((res) => setDetail(res.data))
      .catch((err) => console.log("error occurred", err));
  }, [id]);

    const stopprop = (e) => e.stopPropagation();

    const isInCart = (id)=>{
      return cartItems.find((item)=>item.id === id)
    }


  return (
    <div>
      <Navbar />
      <div className={styles.productDetailContainer}>
        <img
          className={styles.productImage}
          src={detail.image}
          alt={detail.title}
        />
        <div className={styles.productInfo}>
          <h3>{detail.title}</h3>
          <p className="description">{detail.description}</p>
          <p className="price">₹{detail.price}</p>
          {isInCart(detail.id)?(
            <button 
            onClick={(e)=>{
            stopprop(e)
            navigate("/cart")
          }}>
            Go to cart
          </button>

          ):( <button
            className={styles.addToCartBtn}
            onClick={() => Cart(detail)}
          >
            Add to cart
          </button>)}
         
           <button
                     onClick={(e) => {
                       stopprop(e);
                       if(!email){
      navigate('/login')
      return;
    }
                       // Save product temporarily in localStorage for checkout
                       // localStorage.setItem("buyNowProduct", JSON.stringify(product));
                       navigate("/OrderForm"); // navigate to order form page
                     }}
                     className="buyNowButton"
                   >
                     Buy Now
                   </button>
        </div>
      </div>
    </div>
  );
};
