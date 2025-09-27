import axios from 'axios'
import React from 'react'
import { toast } from "react-toastify"; //


async function Cart(product) {
    const email = localStorage.getItem("email")
    console.log(product)
    try{
          if(!email){
        console.error("User email not found")
        return;
    }
    const res  = await axios.get(`http://localhost:3000/user?email=${email}`)
    const user = res.data[0]
    console.log(user)
      
    let updateCart
    const exCart = user.cart||[]
    const cartitem = exCart.find(item=>item.id===product.id)
    //  alert(`${product.title} added to cart`)

    if(cartitem){
        updateCart = exCart.map(p=>p.id=== product.id?{...p,quantity:(p.quantity||1)+1}:p)
        

    }else{
        updateCart=[...exCart,{...product,quantity:1}]
    }
  await axios.patch(`http://localhost:3000/user/${user.id}`,{
    cart:updateCart
  })
toast.success(`${product.title} added to cart`, {
  style: { background: "#007bff", color: "#fff" }
});  console.log("cart updated succesfully")

 

    }
    catch(err){
        console.log(err)

    } 
  


}

export default Cart