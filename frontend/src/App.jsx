import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Footer from './components/Footer'
import Navbar from './components/Header'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Favorites from './pages/Favorites'
import Signup from './pages/Signup'
import Login from './pages/Login'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Profile from './pages/Profile'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import AdminDashboard from './admin/AdminDashboard'
import AddProduct from './admin/AddProduct'
import AdminOrders from './admin/AdminOrders'
import AdminProducts from './admin/AdminProducts'
import AdminCategories from './admin/AdminCategories'
import EditProduct from './admin/EditProducts'
import AdminUsers from './admin/AdminUsers'
import './App.css'

const ScrollToTop = () => {
  const { pathname, search } = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}

function App() {

  return (
    <Router>
      <ScrollToTop />
      <Navbar />
      <div className="pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-0">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/register" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/checkout" element={<Checkout/>} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/categories" element={<AdminCategories />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
        <Footer />
      </div>
    </Router>
  )
}

export default App
