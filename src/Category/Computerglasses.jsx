import React, { useEffect, useState} from 'react'
import  './Category.css'
import axios from 'axios'
import { Navbar } from '../Navbar'
import { Context } from '../Search'
import { useContext } from 'react'
import { FaHeart } from "react-icons/fa";
import { useNavigate } from 'react-router-dom'
import Cart from '../Cart'


export const Computerglasses = () => {
    const navigate = useNavigate();

  const {search,setSearch,cartItems,setCartItems,wishlist,setWishlist}=useContext(Context)
  const [comp,setcomp] = useState([])
    const email = localStorage.getItem("email");

  useEffect(()=>{
    axios.get("http://localhost:3000/products")
    .then((res)=>{
      const item  = res.data.filter((product)=>product.category ==="Computer Glasses"

      )
      setcomp(item)
    
    })
    .catch((error)=>console.error("error occuerd",error))

  },[])


  
const handleAddToCart = async (product) => {
  await Cart(product); // call your existing cart function
  // Update local cartItems state after adding
  const res = await axios.get(`http://localhost:3000/user?email=${email}`);
  setCartItems(res.data[0].cart || []);
};

  const stopprop = (e) => e.stopPropagation();
  
    const handleWishlist = async (product, e) => {
    stopprop(e);

    if (!email) return;

    const res = await axios.get(`http://localhost:3000/user?email=${email}`);
    const user = res.data[0];
    let updatedWishList;

    if (wishlist.some((item) => item.id === product.id)) {
      // Remove from wishlist
      updatedWishList = wishlist.filter((item) => item.id !== product.id);
    } else {
      // Add to wishlist
      updatedWishList = [...wishlist, product];
    }

    // Update JSON Server
    await axios.patch(`http://localhost:3000/user/${user.id}`, {
      WishList: updatedWishList
    });

    setWishlist(updatedWishList); // update local state
  };


  

  return (
    
   <>
   <Navbar/>
   <div style={{ textAlign: "center", margin: "40px 0" }}>
  <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#222" }}>
    Computer Glasses Collection
  </h1>
  <p style={{ fontSize: "1.2rem", color: "#555", marginTop: "10px" }}>
    Protect your eyes from digital strain with our computer glasses featuring blue light filters and anti-glare lenses for work and gaming.
  </p>
</div>

    <div className="container">
         {comp
           .filter((pro) =>
             search.toLowerCase() === ""
               ? pro
               : pro.title.toLowerCase().includes(search.toLowerCase())
           )
           .map((product) => {
             const isWishlisted = wishlist.some((item) => item.id === product.id);
   
             return (
               <div
                 onClick={() => navigate(`/productdetails/${product.id}`)}
                 key={product.id}
                 className="card"
               >
                 <img
                   src={product.image}
                   alt={product.title}
                   className="image"
                 />
   
                 <FaHeart
                   onClick={(e) => handleWishlist(product, e)}
                   className="wishlistIcon"
                   style={{ color: isWishlisted ? "red" : "gray" }}
                 />
   
                 <div className="content">
                   <h3 className="title">{product.title}</h3>
                   <p className="price">₹{product.price}</p>
                 <button
     onClick={(e) => {
       const inCart = cartItems.some((item) => item.id === product.id);
       if (inCart) {
         navigate("/cart"); // Go to cart page
       } else {
         handleAddToCart(product); // Add to cart
       }
       stopprop(e);
     }}
     className="button"
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
                     className="buyNowButton"
                   >
                     Buy Now
                   </button> */}
  
   
                 </div>
               </div>
             );
           })}
       </div>
    </>
   
  );
}
