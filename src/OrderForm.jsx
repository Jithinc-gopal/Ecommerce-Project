import React, { useState, useContext } from "react";
import axios from "axios";
import { Context } from "./Search";
import { Navbar } from "./Navbar";
import styles from "./OrderForm.module.css";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const OrderForm = () => {
  const navigate = useNavigate()
  const { cartItems, setCartItems } = useContext(Context);
  const [error,setError] = useState({})
  const email = localStorage.getItem("email");

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    payment: "COD",
  });

  // const totalAmount = cartItems.reduce((acc, item) => acc + item.price, 0);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


    const validation = () => {
    const errvar = {}
    if (!formData.name || formData.name.length < 5) {
      errvar.name = "name must contain 5 character"
    }
    if (!formData.phone) {
      errvar.phone = "phone number is required"
    } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
      errvar.phone = "Invalid phone number"
    }
    if (!formData.address) {
      errvar.address = "address  is required"
    }
     if (!formData.pincode) {
      errvar.pincode = "pincode  is required"
    }if(!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
      errvar.pincode = "invalied pincode"
    }
    if (!formData.payment) {
      errvar.payment = "please choose a payment method"
    }
   
    return errvar
  }
  

  const handleSubmit = async (e) => {
    e.preventDefault();
        const err = validation()
    setError(err)
    if (Object.keys(err).length === 0){

    try {
    
      // Save order in db.json
      // await axios.post("http://localhost:3000/user", {
      //   email,
      //   customer: formData,
      //   items: cartItems,
      //   total: totalAmount,
      //   status: "Pending",
      //   date: new Date().toLocaleString(),
      // });

      // Clear cart after order
      const res = await axios.get(`http://localhost:3000/user?email=${email}`);
      const user = res.data[0];
      const order  = user.cart || []
      console.log(user)
      await axios.put(`http://localhost:3000/user/${user.id}`,{
        ...user,
        orders:[...user.orders || [] ,...order],
        cart:[]
      })
      setFormData({
          name: "",
          phone: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          payment: "COD",

      })
       
   navigate("/MyOrders")
      toast.success("✅ Order placed successfully!");
      console.log("order successfull")
    } catch (error) {
      console.error("Error placing order", error);
      alert("❌ Failed to place order");
    }
  
  };
}

  return (
    <>
      <Navbar />
      <div className={styles.container}>
        <h2>Checkout</h2>
        <form className={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
          
          />
                  <p className={styles.error}>{error.name}</p>
          
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            
          />
                  <p className={styles.error}>{error.phone}</p>
          
          <textarea
            name="address"
            placeholder="Street Address"
            value={formData.address}
            onChange={handleChange}
            
          />
                  <p className={styles.error}>{error.address}</p>
          
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            
          />
                  <p className={styles.error}>{error.city}</p>
          
          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
            
          />
          
          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
            
          />
                  <p className={styles.error}>{error.pincode}</p>
          

          <label>Payment Method:</label>
          <select name="payment" value={formData.payment} onChange={handleChange}>
            <option value="COD">Cash on Delivery</option>
            <option value="UPI">UPI</option>
            <option value="Card">Card</option>
          </select>
                  <p className={styles.error}>{error.payment}</p>
          

       
          <button type="submit">Place Order</button>
        </form>
      </div>
    </>
  );
};
