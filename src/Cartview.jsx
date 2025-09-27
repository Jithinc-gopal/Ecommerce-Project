import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { Context } from './Search';
import { useContext } from 'react';
import styles from "./Cart.module.css";
import { Navbar } from './Navbar';
import { Payment } from './payment';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



export const Cartview = () => {
  const navigate  = useNavigate()
        const email = localStorage.getItem("email")

    const {search} = useContext(Context)
    const [cart,setCart] = useState([])

    useEffect(()=>{
        axios.get(`http://localhost:3000/user?email=${email}`)
        .then((res)=>{
            const user = res.data[0]
            const userCart = user.cart||[]
            setCart(userCart)
        })
        .catch((err)=>console.log("email not found",err))
    },[email])


  async function deleteCart(product) {
    try{
         const res = await  axios.get(`http://localhost:3000/user?email=${email}`)
  const userdata = res.data[0]
  const updateuser = userdata.cart.filter((item)=>item.id!== product.id)

  await axios.patch(`http://localhost:3000/user/${userdata.id}`,{
      cart:updateuser

  })
  setCart(updateuser)
  console.log("product removed from cart")
toast.success(`${product.title} removed from cart`, {
  style: { background: "#dc3545", color: "#fff" }
});    }
    catch(err){
        console.log("error occuerd",err)

    }  
    
  }


  //decrement cart quantity
 async function decreaseQty(product) {
  try{
    const res =await axios.get(`http://localhost:3000/user?email=${email}`)
    const item = res.data[0]
    const updatecart = item.cart.map((prod)=>
      prod.id === product.id?{...prod,quantity:(prod.quantity-1)}:prod
    )
    await axios.patch(`http://localhost:3000/user/${item.id}`,{
      cart:updatecart
    })
    setCart(updatecart)
    console.log("quantity updated")

  }
  catch(error){
    console.log("error",error)
  }
  
 }

     const stopprop = (e) => e.stopPropagation();


 //increment car quantity
  async function  increaseQty(product) {
  try{
    const res =await axios.get(`http://localhost:3000/user?email=${email}`)
    const user = res.data[0]
    const updatecart = user.cart.map((item)=>
      item.id === product.id?{...item,quantity:(item.quantity+1)}:item
    )
    await axios.patch(`http://localhost:3000/user/${user.id}`,{
      cart:updatecart
    })
    setCart(updatecart)
    console.log("quantity updated succsfully")

  }
  catch(error){
    console.log("error",error)
  }
  
 }

   if (cart.length === 0) {
    return (
      <>
        <Navbar />
        <div className={styles.emptyCart}>
          <img src="https://i.pinimg.com/736x/ef/49/c2/ef49c25011c052d4d1ec994241c9a76f.jpg" alt="Empty Cart" className={styles.emptyImage} />
          <h2>Your Cart is Empty</h2>
          <p style={{margin:"10px"}}>Looks like you haven't added anything to your cart yet.</p>
          <button onClick={() => navigate("/Home")} className={styles.shopButton}>
            Go to Shop
          </button>
        </div>
      </>
    )
  }


  return (<>
    <Navbar/>
   
   <div className={styles.pageWrapper}>
  <div className={styles.container}>
      {cart
      .filter((pro)=>
    search.toLowerCase()===""
      ? pro
      : pro.title.toLowerCase().includes(search.toLowerCase())
    )
    .map((product) => (
        <div key={product.id} className={styles.card}>
          <img
            src={product.image}
            alt={product.title}
            className={styles.image}
          />
          <div className={styles.content}>
            <h3 className={styles.title}>{product.title}</h3>
            <p className={styles.price}>₹{product.price}</p>
               <div className={styles.qtyControls}>
                  <button onClick={() => decreaseQty(product)} disabled={product.quantity<=1}>-</button>
                  <span className={styles.qty}>{product.quantity || 1}</span>
                  <button onClick={() => increaseQty(product)}>+</button>
                </div>
            <button onClick={()=>deleteCart(product)} className={styles.button}>Remove from cart</button>
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

  <div className={styles.paymentSection}>
    <Payment cart={cart} />
  </div>
</div>

    </>
  );
};

