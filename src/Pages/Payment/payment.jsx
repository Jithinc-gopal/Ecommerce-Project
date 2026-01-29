import React from 'react'
import styles from './Payment.module.css'
import { useNavigate } from 'react-router-dom'

export const Payment = ({ cart }) => {
  const navigate = useNavigate()
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = subtotal > 5000 ? subtotal * 0.2 : 0
  const shipping = subtotal > 0 ? 10 : 0
  const total = subtotal - discount + shipping

  return (
    <div className={styles.paymentContainer}>
      <h3>Order Summary</h3>
      <hr />
      <h4>Subtotal: ₹{subtotal.toFixed(2)}</h4>
      {discount > 0 && <h4 className={styles.discount}>Discount: -₹{discount.toFixed(2)}</h4>}
      <h4 className={styles.shipping}>Shipping Charge: ₹{shipping.toFixed(2)}</h4>
      <h3 className={styles.total}>Total Amount: ₹{total.toFixed(2)}</h3>
      <button onClick={()=>navigate("/OrderForm")} className={styles.paymentButton}>Proceed to Payment</button>
    </div>
  )
}
