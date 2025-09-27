import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import styles from "./Products.module.css"; 
import { Context } from "./Search";
import Cart from "./Cart";
import { useNavigate } from "react-router-dom";
import { FaHeart } from "react-icons/fa";



export const Products = () => {
  const navigate = useNavigate();
  const { search,wishlist,setWishlist,cartItems,setCartItems } = useContext(Context);
  const [products, setProducts] = useState([]);
  // const [wishlist, setWishlist] = useState([]);
  // const [cartItems, setCartItems] = useState([]);
  const email = localStorage.getItem("email");

  // Fetch products
  useEffect(() => {
    axios
      .get("http://localhost:3000/products")
      .then((res) => setProducts(res.data))
      .catch((error) =>
        console.error("Error fetching products", error)
      );
  }, []);



useEffect(() => {
  if (!email) return;
  axios
    .get(`http://localhost:3000/user?email=${email}`)
    .then((res) => {
      const user = res.data[0];
      setCartItems(user.cart || []);
    })
    .catch((err) => console.log("Error fetching cart", err));
}, [email]);


const handleAddToCart = async (product) => {
  await Cart(product); // call your existing cart function
  // Update local cartItems state after adding
  const res = await axios.get(`http://localhost:3000/user?email=${email}`);
  setCartItems(res.data[0].cart || []);
};



  // Fetch wishlist from JSON Server
  useEffect(() => {
    if (!email) return;
    axios
      .get(`http://localhost:3000/user?email=${email}`)
      .then((res) => {
        const user = res.data[0];
        setWishlist(user.WishList || []);
      })
      .catch((err) => console.log("Error fetching wishlist", err));
  }, [email]);

  const stopprop = (e) => e.stopPropagation();

  // Toggle wishlist in JSON Server
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
    <div className={styles.container}>
      {products
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
              className={styles.card}
            >
              <img
                src={product.image}
                alt={product.title}
                className={styles.image}
              />

              <FaHeart
                onClick={(e) => handleWishlist(product, e)}
                className={styles.wishlistIcon}
                style={{ color: isWishlisted ? "#8B0000" : "white" }}
              />

              <div className={styles.content}>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.price}>₹{product.price}</p>
                <div className={styles.buttonGroup}>
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
    if(!email){
      navigate('/login')
      return;
    }
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
            </div>
          );
        })}
    </div>
  );
};
