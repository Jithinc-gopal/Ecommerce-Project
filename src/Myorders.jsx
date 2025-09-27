import axios from 'axios'
import React, { useEffect, useState } from 'react'
import styles from './Myorders.module.css'
import { Navbar } from './Navbar'
import { useNavigate } from 'react-router-dom'


export const Myorders = () => {
    const navigate  = useNavigate()
    const email = localStorage.getItem("email")
    const [order,setOrder] = useState([])
    
    useEffect(()=>{
        axios.get(`http://localhost:3000/user?email=${email}`)
        .then((res)=>{
            const user = res.data[0]
           
            const userOrder = user.orders || []
            setOrder(userOrder)
            console.log(userOrder)

})
.catch((err)=>console.log("email not found",err))
},[email])

 if (order.length === 0) {
    return (
      <>
        <Navbar />
        <div className={styles.emptyorder}>
          {/* <img src="https://i.pinimg.com/736x/72/e9/43/72e943132cad64c5f68e609b81309a90.jpg" alt="Empty Cart" className={styles.emptyImage} /> */}
          <h2>No Orders</h2>
          <p>Looks like you haven't Order anything .</p>
          <button onClick={() => navigate("/Home")} className={styles.shopButton}>
            Go to Shop
          </button>
        </div>
      </>
    )
  }


  return (
    <>
    <Navbar/>
     <div className={styles.container}>
            {order.map((product) => (
              <div key={product.id} className={styles.card}>
                <img
                  src={product.image}
                  alt={product.title}
                  className={styles.image}
                />
                <div className={styles.content}>
                  <h3 className={styles.title}>{product.title}</h3>
                  <p className={styles.price}>₹{product.price}</p>
                  <p className={styles.price}>Status:{product.status}</p>
                  
                  
                </div>
                
              
              </div>
              
              
            ))}
          
             


          </div>
          
            <div style={{display:'flex',justifyContent:'center'}}>
               <button className={styles.btn} onClick={()=>navigate("/Home")}>Go To Home </button>
            </div>
          
    
    </>
        )
}
