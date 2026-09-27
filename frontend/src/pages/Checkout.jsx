import React, { useState, useContext} from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '@/components/context/AuthContext'
import  { clearCart } from '../store/cartSlice'

const Checkout = () => {
    const { user } = useContext(AuthContext);
    const cartItems = useSelector((state) => state.cart.cartItems)
    const dispatch = useDispatch();
    const navigate = useNavigate()

    const [address, setAddress] = useState({
      fullName: "", street: "", city: "", postalCode: "", country: ""
    });

    const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

    const handlePayment = async () => {
      try {
        const orderRes = await fetch("api/payment/order", {
          method: 'POST',
          headers: { 'Content-Type': 'application/json'},
          
        });
      } catch (error) {
        
      }
    }
  return (
    <div>Checkout</div>
  )
}

export default Checkout